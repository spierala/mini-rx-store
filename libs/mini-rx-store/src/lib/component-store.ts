import { BaseStore } from './base-store';
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
    ExtensionId,
    MetaReducer,
    miniRxError,
    OperationType,
    Reducer,
    StateOrCallback,
    undo,
} from '@mini-rx/common';

let componentStoreConfig: ComponentStoreConfig | undefined = undefined;

export function configureComponentStores(config: ComponentStoreConfig) {
    if (!componentStoreConfig) {
        componentStoreConfig = config;
        return;
    }
    miniRxError('`configureComponentStores` was called multiple times.');
}

const csFeatureKey = 'component-store';

export class ComponentStore<StateType extends object>
    extends BaseStore<StateType>
    implements ComponentStoreLike<StateType>
{
    private actionsOnQueue = createActionsOnQueue();
    private readonly combinedMetaReducer: MetaReducer<StateType>;
    private reducer: Reducer<StateType> | undefined;
    private readonly hasUndoExtension: boolean = false;

    constructor(initialState?: StateType, config?: ComponentStoreConfig) {
        super();

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

        this._sub.add(
            this.actionsOnQueue.actions$.subscribe((action) => {
                const newState: StateType = this.reducer!(
                    // We are sure, there is a reducer!
                    this._state.get()!, // Initially undefined, but the reducer can handle undefined (by falling back to initial state)
                    action
                );
                this._state.set(newState);
            })
        );

        if (initialState) {
            this.setInitialState(initialState);
        }
    }

    override setInitialState(initialState: StateType): void {
        super.setInitialState(initialState);

        this.reducer = this.combinedMetaReducer(createComponentStoreReducer(initialState));
        this.dispatch({
            type: createMiniRxActionType(OperationType.INIT, csFeatureKey),
        });
    }

    /** @internal
     * Implementation of abstract method from BaseStore
     */
    _dispatchSetStateAction(
        stateOrCallback: StateOrCallback<StateType>,
        name: string | undefined
    ): Action {
        const action: Action = {
            type: createMiniRxActionType(OperationType.SET_STATE, csFeatureKey, name),
            stateOrCallback,
        };
        this.dispatch(action);
        return action;
    }

    private dispatch(action: Action) {
        this.actionsOnQueue.dispatch(action);
    }

    // Implementation of abstract method from BaseStore
    undo(action: Action) {
        this.hasUndoExtension
            ? this.dispatch(undo(action))
            : miniRxError(`${this.constructor.name} has no UndoExtension yet.`);
    }

    override destroy() {
        if (this.reducer) {
            // Dispatch an action really just for logging via LoggerExtension
            // Only dispatch if a reducer exists (if an initial state was provided or setInitialState was called)
            this.dispatch({
                type: createMiniRxActionType(OperationType.DESTROY, csFeatureKey),
            });
        }
        super.destroy();
    }
}

export function createComponentStore<T extends object>(
    initialState?: T | undefined,
    config?: ComponentStoreConfig
): ComponentStore<T> {
    return new ComponentStore<T>(initialState, config);
}
