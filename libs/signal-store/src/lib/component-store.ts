import { createBaseStore } from './base-store';
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
    MiniRxAction,
    miniRxError,
    OperationType,
    Reducer,
    StateOrCallback,
    StoreType,
    undo,
} from '@mini-rx/common';
import { createSelectableSignalState } from './selectable-signal-state';
import { DestroyRef, inject, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ComponentStoreLike } from './models';

let componentStoreConfig: ComponentStoreConfig | undefined = undefined;

// This function exists for testing purposes only
export function _resetConfig() {
    componentStoreConfig = undefined;
}

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
    private _state: WritableSignal<StateType> = signal(this.initialState);
    private selectableState = createSelectableSignalState(this._state);
    state: Signal<StateType> = this.selectableState.select();
    private readonly combinedMetaReducer: MetaReducer<StateType>;
    private readonly reducer: Reducer<StateType>;
    private hasUndoExtension = false;
    private extensions: ComponentStoreExtension[] = []; // This is a class property just for testing purposes

    private dispatcher(
        stateOrCallback: StateOrCallback<StateType>,
        operationType: OperationType,
        name: string | undefined
    ): MiniRxAction<StateType> {
        const action: MiniRxAction<StateType> = {
            storeType: StoreType.COMPONENT_STORE,
            type: createMiniRxActionType(operationType, csFeatureKey, name),
            stateOrCallback,
        };
        this.dispatch(action);
        return action;
    }

    private baseStore = createBaseStore(this.dispatcher.bind(this));
    private destroyRef = inject(DestroyRef);

    constructor(private initialState: StateType, config?: ComponentStoreConfig) {
        this.destroyRef.onDestroy(() => this.destroy());

        const metaReducers: MetaReducer<StateType>[] = [];
        this.extensions = calculateExtensions(config, componentStoreConfig);
        this.extensions.forEach((ext) => {
            metaReducers.push(ext.init()); // Non-null assertion: Here we know for sure: init will return a MetaReducer

            if (ext.id === ExtensionId.UNDO) {
                this.hasUndoExtension = true;
            }
        });

        this.combinedMetaReducer = combineMetaReducers(metaReducers);
        this.reducer = this.combinedMetaReducer(createComponentStoreReducer(initialState));

        this.actionsOnQueue.actions$.pipe(takeUntilDestroyed()).subscribe((action) => {
            const newState: StateType = this.reducer(this.state(), action);
            this._state.set(newState);
        });

        this.dispatch({ type: createMiniRxActionType(OperationType.INIT, csFeatureKey) });
    }

    private dispatch(action: Action): void {
        this.actionsOnQueue.dispatch(action);
    }

    undo(action: Action): void {
        this.hasUndoExtension
            ? this.dispatch(undo(action))
            : miniRxError(`${this.constructor.name} has no UndoExtension yet.`);
    }

    select = this.selectableState.select;
    update = this.baseStore.update;
    rxEffect = this.baseStore.rxEffect;
    connect = this.baseStore.connect;

    private destroy(): void {
        // Dispatch an action really just for logging via LoggerExtension
        this.dispatch({ type: createMiniRxActionType(OperationType.DESTROY, csFeatureKey) });
    }
}

export function createComponentStore<T extends object>(
    initialState: T,
    config?: ComponentStoreConfig
): ComponentStore<T> {
    return new ComponentStore<T>(initialState, config);
}
