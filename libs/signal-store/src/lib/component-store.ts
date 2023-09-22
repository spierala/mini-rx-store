import { BaseStore } from './base-store';
import {
    Action,
    ComponentStoreConfig,
    ComponentStoreExtension,
    ComponentStoreLike,
    ExtensionId,
    MetaReducer,
    Reducer,
    StateOrCallback,
} from './models';
import { calcNewState, combineMetaReducers, miniRxError, sortExtensions } from './utils';
import {
    createMiniRxActionType,
    isMiniRxAction,
    OperationType,
    MiniRxAction,
    StoreType,
    undo,
} from './actions';
import { ActionsOnQueue } from './actions-on-queue';
import { SelectableSignalState } from './selectable-signal-state';
import { Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

export class ComponentStore<StateType extends object>
    extends BaseStore<StateType>
    implements ComponentStoreLike<StateType>
{
    private actionsOnQueue = new ActionsOnQueue();
    private _state: WritableSignal<StateType> = signal(this.initialState);
    private selectableState = new SelectableSignalState(this._state);
    state: Signal<StateType> = this.selectableState.select();
    private readonly combinedMetaReducer: MetaReducer<StateType>;
    private readonly reducer: Reducer<StateType>;
    private hasUndoExtension = false;
    private extensions: ComponentStoreExtension[] = []; // This is a class property just for testing purposes

    constructor(private initialState: StateType, config?: ComponentStoreConfig) {
        super();

        this._destroyRef.onDestroy(() => this.destroy());

        const metaReducers: MetaReducer<StateType>[] = [];

        if (config?.extensions) {
            if (config.extensions && componentStoreConfig?.extensions) {
                this.extensions = mergeExtensions(
                    componentStoreConfig.extensions,
                    config.extensions
                );
            } else {
                this.extensions = config.extensions;
            }
        } else if (componentStoreConfig?.extensions) {
            this.extensions = componentStoreConfig.extensions;
        }

        sortExtensions(this.extensions).forEach((ext) => {
            if (!ext.hasCsSupport) {
                miniRxError(
                    `Extension "${ext.constructor.name}" is not supported by Component Store.`
                );
            }

            metaReducers.push(ext.init()!); // Non-null assertion: Here we know for sure: init will return a MetaReducer

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

    /** @internal
     * Implementation of abstract method from BaseStore
     */
    _dispatchSetStateAction(
        stateOrCallback: StateOrCallback<StateType>,
        actionType: OperationType,
        name: string | undefined
    ): MiniRxAction<StateType> {
        const action: MiniRxAction<StateType> = {
            storeType: StoreType.COMPONENT_STORE,
            type: createMiniRxActionType(actionType, csFeatureKey, name),
            stateOrCallback,
        };
        this.dispatch(action);
        return action;
    }

    private dispatch(action: Action): void {
        this.actionsOnQueue.dispatch(action);
    }

    // Implementation of abstract method from BaseStore
    undo(action: Action): void {
        this.hasUndoExtension
            ? this.dispatch(undo(action))
            : miniRxError(`${this.constructor.name} has no UndoExtension yet.`);
    }

    select = this.selectableState.select.bind(this.selectableState);

    private destroy(): void {
        // Dispatch an action really just for logging via LoggerExtension
        this.dispatch({ type: createMiniRxActionType(OperationType.DESTROY, csFeatureKey) });
    }
}

function createComponentStoreReducer<StateType>(initialState: StateType): Reducer<StateType> {
    return (state: StateType = initialState, action: Action) => {
        if (isMiniRxAction<StateType>(action, StoreType.COMPONENT_STORE)) {
            return calcNewState(state, action.stateOrCallback);
        }
        return state;
    };
}

function mergeExtensions(
    global: ComponentStoreExtension[],
    local: ComponentStoreExtension[]
): ComponentStoreExtension[] {
    // Local extensions overwrite the global extensions
    // If extension is global and local => use local
    // If extension is only global => use global
    // If extension is only local => use local

    const extensions: ComponentStoreExtension[] = [];
    let globalCopy = [...global];
    let localCopy = [...local];

    global.forEach((globalExt) => {
        local.forEach((localExt) => {
            if (localExt.id === globalExt.id) {
                // Found extension which is global and local
                extensions.push(localExt); // Use local!
                localCopy = localCopy.filter((item) => item.id !== localExt.id); // Remove found extension from local
                globalCopy = globalCopy.filter((item) => item.id !== globalExt.id); // Remove found extension from global
            }
        });
    });

    return [
        ...extensions, // Extensions which are global and local, but use local
        ...localCopy, // Local only
        ...globalCopy, // Global only
    ];
}

export function createComponentStore<T extends object>(
    initialState: T,
    config?: ComponentStoreConfig
): ComponentStore<T> {
    return new ComponentStore<T>(initialState, config);
}
