import { DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import {
    Action,
    calculateExtensions,
    combineMetaReducers,
    componentStoreConfig,
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
    StateOrCallback,
    undo,
    UpdateStateCallback,
} from '@mini-rx/common';
import { createSelectableSignalState } from './selectable-signal-state';
import { ComponentStoreLike } from './models';
import { createRxEffectFn } from './rx-effect';
import { createConnectFn } from './connect';
import { createUpdateFn } from './update';
import { createSignalStoreSubSink } from './signal-store-sub-sink';

const csFeatureKey = 'component-store';
export const globalCsConfig = componentStoreConfig();

export class ComponentStore<StateType extends object> implements ComponentStoreLike<StateType> {
    private readonly hasUndoExtension: boolean = false;

    private actionsOnQueue = createActionsOnQueue();

    private _state: WritableSignal<StateType> = signal(this.initialState);
    get state(): StateType {
        return this._state();
    }

    private updateState: UpdateStateCallback<StateType> = (
        stateOrCallback: StateOrCallback<StateType>,
        operationType: OperationType,
        name: string | undefined
    ): MiniRxAction<StateType> => {
        return this.actionsOnQueue.dispatch({
            type: createMiniRxActionType(operationType, csFeatureKey, name),
            stateOrCallback,
        });
    };

    constructor(private initialState: StateType, config?: ComponentStoreConfig) {
        inject(DestroyRef).onDestroy(() => this.destroy());

        const extensions: ComponentStoreExtension[] = calculateExtensions(
            config,
            globalCsConfig.get()
        );
        const metaReducers: MetaReducer<StateType>[] = extensions.map((ext) => ext.init());
        this.hasUndoExtension = extensions.some((ext) => ext.id === ExtensionId.UNDO);

        const combinedMetaReducer = combineMetaReducers(metaReducers);
        const reducer = combinedMetaReducer(createComponentStoreReducer(initialState));

        const subSink = createSignalStoreSubSink();
        subSink.sink = this.actionsOnQueue.actions$.subscribe((action) => {
            const newState: StateType = reducer(this.state, action);
            this._state.set(newState);
        });

        this.actionsOnQueue.dispatch({
            type: createMiniRxActionType(OperationType.INIT, csFeatureKey),
        });
    }

    undo(action: Action): void {
        this.hasUndoExtension
            ? this.actionsOnQueue.dispatch(undo(action))
            : miniRxError(`${this.constructor.name} has no UndoExtension yet.`);
    }

    setState = createUpdateFn(this.updateState);
    connect = createConnectFn(this.updateState);
    rxEffect = createRxEffectFn();
    select = createSelectableSignalState(this._state).select;

    private destroy(): void {
        // Dispatch an action really just for logging via LoggerExtension
        this.actionsOnQueue.dispatch({
            type: createMiniRxActionType(OperationType.DESTROY, csFeatureKey),
        });
    }
}

export function createComponentStore<T extends object>(
    initialState: T,
    config?: ComponentStoreConfig
): ComponentStore<T> {
    return new ComponentStore<T>(initialState, config);
}
