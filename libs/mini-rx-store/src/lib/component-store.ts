import { ComponentStoreLike } from './models';
import {
    Action,
    calculateExtensions,
    combineMetaReducers,
    ComponentStoreConfig,
    ComponentStoreExtension,
    createActionsOnQueue,
    createComponentStoreReducer,
    createMiniRxActionType,
    createSubSink,
    ExtensionId,
    MetaReducer,
    MiniRxAction,
    miniRxError,
    OperationType,
    Reducer,
    StateOrCallback,
    undo,
    UpdateStateCallback,
} from '@mini-rx/common';
import { createEffectFn } from './effect';
import { createUpdateFn } from './update';
import { createState } from './state';
import { Observable } from 'rxjs';
import { assertStateIsInitialized, assertStateIsNotInitialized } from './assert-state';
import { createConnectFn } from './connect';

let componentStoreConfig: ComponentStoreConfig | undefined = undefined;

export function configureComponentStores(config: ComponentStoreConfig) {
    if (!componentStoreConfig) {
        componentStoreConfig = config;
        return;
    }
    miniRxError('`configureComponentStores` was called multiple times.');
}

const csFeatureKey = 'component-store';

export class ComponentStore<StateType extends object> implements ComponentStoreLike<StateType> {
    private actionsOnQueue = createActionsOnQueue();
    private readonly combinedMetaReducer: MetaReducer<StateType>;
    private reducer: Reducer<StateType> | undefined;
    private readonly hasUndoExtension: boolean = false;

    private subSink = createSubSink();

    private _state = createState<StateType>();
    state$: Observable<StateType> = this._state.select();
    get state(): StateType {
        assertStateIsInitialized(this._state, this.constructor.name);
        return this._state.get()!;
    }

    private updateState: UpdateStateCallback<StateType> = (
        stateOrCallback: StateOrCallback<StateType>,
        operationType: OperationType,
        name: string | undefined
    ): MiniRxAction<StateType> => {
        assertStateIsInitialized(this._state, this.constructor.name);
        return this.actionsOnQueue.dispatch({
            type: createMiniRxActionType(operationType, csFeatureKey, name),
            stateOrCallback,
        });
    };

    constructor(initialState?: StateType, config?: ComponentStoreConfig) {
        const extensions: ComponentStoreExtension[] = calculateExtensions(
            config,
            componentStoreConfig
        );
        const metaReducers: MetaReducer<StateType>[] = extensions.map((ext) => {
            if (!ext.hasCsSupport) {
                miniRxError(
                    `Extension "${ext.constructor.name}" is not supported by Component Store.`
                );
            }
            return ext.init();
        });
        this.hasUndoExtension = extensions.some((ext) => ext.id === ExtensionId.UNDO);

        this.combinedMetaReducer = combineMetaReducers(metaReducers);

        this.subSink.sink = this.actionsOnQueue.actions$.subscribe((action) => {
            const newState: StateType = this.reducer!(
                // We are sure, there is a reducer!
                this._state.get()!, // Initially undefined, but the reducer can handle undefined (by falling back to initial state)
                action
            );
            this._state.set(newState);
        });

        if (initialState) {
            this.setInitialState(initialState);
        }
    }

    setInitialState(initialState: StateType): void {
        assertStateIsNotInitialized(this._state, this.constructor.name);

        this.reducer = this.combinedMetaReducer(createComponentStoreReducer(initialState));
        this.actionsOnQueue.dispatch({
            type: createMiniRxActionType(OperationType.INIT, csFeatureKey),
        });
    }

    // Implementation of abstract method from BaseStore
    undo(action: Action) {
        this.hasUndoExtension
            ? this.actionsOnQueue.dispatch(undo(action))
            : miniRxError(`${this.constructor.name} has no UndoExtension yet.`);
    }

    setState = createUpdateFn(this.updateState);
    connect = createConnectFn(this.updateState, this.subSink);
    effect = createEffectFn(this.subSink);
    select = this._state.select;

    destroy() {
        if (this.reducer) {
            // Dispatch an action really just for logging via LoggerExtension
            // Only dispatch if a reducer exists (if an initial state was provided or setInitialState was called)
            this.actionsOnQueue.dispatch({
                type: createMiniRxActionType(OperationType.DESTROY, csFeatureKey),
            });
        }
        this.subSink.unsubscribe();
    }

    /**
     * @internal
     * Can be called by Angular if ComponentStore/FeatureStore is provided in a component
     */
    ngOnDestroy() {
        this.destroy();
    }
}

export function createComponentStore<T extends object>(
    initialState?: T | undefined,
    config?: ComponentStoreConfig
): ComponentStore<T> {
    return new ComponentStore<T>(initialState, config);
}
