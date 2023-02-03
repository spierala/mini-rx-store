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
    ComponentStoreSetStateAction,
    createMiniRxAction,
    createMiniRxActionType,
    isComponentStoreSetStateAction,
    MiniRxActionType,
    SetStateActionType,
    undo,
} from './actions';
import { ActionsOnQueue } from './actions-on-queue';

let componentStoreConfig: ComponentStoreConfig | undefined = undefined;

/** @internal
 * This function exists for testing purposes only
 */
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
    private readonly combinedMetaReducer: MetaReducer<StateType>;
    private reducer: Reducer<StateType> | undefined;
    private hasUndoExtension = false;
    private extensions: ComponentStoreExtension[] = []; // This is a class property just for testing purposes

    constructor(initialState?: StateType, config?: ComponentStoreConfig) {
        super();

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
        this.dispatch(createMiniRxAction(MiniRxActionType.INIT, csFeatureKey));
    }

    /** @internal
     * Implementation of abstract method from BaseStore
     */
    _dispatchSetStateAction(
        stateOrCallback: StateOrCallback<StateType>,
        name: string | undefined
    ): Action {
        const action: Action = createSetStateAction(stateOrCallback, name);
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
            this.dispatch(createMiniRxAction(MiniRxActionType.DESTROY, csFeatureKey));
        }
        super.destroy();
    }
}

function createSetStateAction<T>(
    stateOrCallback: StateOrCallback<T>,
    name?: string
): ComponentStoreSetStateAction<T> {
    const miniRxActionType = MiniRxActionType.SET_STATE;
    return {
        setStateActionType: SetStateActionType.COMPONENT_STORE,
        type: createMiniRxActionType(miniRxActionType, csFeatureKey) + (name ? '/' + name : ''),
        stateOrCallback,
    };
}

function createComponentStoreReducer<StateType>(initialState: StateType): Reducer<StateType> {
    return (state: StateType = initialState, action: Action) => {
        if (isComponentStoreSetStateAction<StateType>(action)) {
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
    initialState?: T | undefined,
    config?: ComponentStoreConfig
): ComponentStore<T> {
    return new ComponentStore<T>(initialState, config);
}
