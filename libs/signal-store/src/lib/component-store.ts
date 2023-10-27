import { DestroyRef, inject, Signal, signal, WritableSignal } from '@angular/core';
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
    private selectableState = createSelectableSignalState(this._state);
    state: Signal<StateType> = this.selectableState.select();

    private dispatcher(
        stateOrCallback: StateOrCallback<StateType>,
        operationType: OperationType,
        name: string | undefined
    ): MiniRxAction<StateType> {
        const action: MiniRxAction<StateType> = {
            type: createMiniRxActionType(operationType, csFeatureKey, name),
            stateOrCallback,
        };
        this.actionsOnQueue.dispatch(action);
        return action;
    }

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
            const newState: StateType = reducer(this.state(), action);
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

    setState = createUpdateFn(this.dispatcher.bind(this));
    connect = createConnectFn(this.dispatcher.bind(this));
    rxEffect = createRxEffectFn();
    select = this.selectableState.select;

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
