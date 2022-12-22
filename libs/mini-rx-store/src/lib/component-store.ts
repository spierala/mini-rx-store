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
import { calcNewState, combineMetaReducers, miniRxError } from './utils';
import { createMiniRxAction, createMiniRxActionType, MiniRxActionType } from './actions';
import { undo } from './extensions/undo.extension';
import { ActionsOnQueue } from './actions-on-queue';

let componentStoreConfig: ComponentStoreConfig | undefined = undefined;

export function configureComponentStores(config: { extensions: ComponentStoreExtension[] }) {
    if (!componentStoreConfig) {
        componentStoreConfig = config;
        return;
    }
    miniRxError('`configureComponentStores` was called multiple times.');
}

export class ComponentStore<StateType extends object>
    extends BaseStore<StateType>
    implements ComponentStoreLike<StateType>
{
    private actionsOnQueue = new ActionsOnQueue();
    private readonly combinedMetaReducer: MetaReducer<StateType>;
    private reducer: Reducer<StateType> | undefined;
    private hasUndoExtension = false;

    constructor(initialState?: StateType, config?: { extensions: ComponentStoreExtension[] }) {
        super();

        let extensions: ComponentStoreExtension[] = [];
        const metaReducers: MetaReducer<StateType>[] = [];

        if (config?.extensions) {
            if (config.extensions && componentStoreConfig?.extensions) {
                extensions = mergeExtensions(componentStoreConfig.extensions, config.extensions);
            } else {
                extensions = config.extensions;
            }
        }

        extensions.forEach((ext) => {
            if (!ext.initForCs) {
                miniRxError(
                    `Extension "${ext.constructor.name}" is not supported by Component Store.`
                );
            }

            metaReducers.push(ext.initForCs());

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
        this.dispatch(createMiniRxAction(MiniRxActionType.INIT_COMPONENT_STORE));
    }

    /** @internal
     * Implementation of abstract method from BaseStore
     */
    _dispatchSetStateAction(
        stateOrCallback: StateOrCallback<StateType>,
        name: string | undefined
    ): Action {
        const action: Action = createSetStateAction(stateOrCallback, 'component-store', name);
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
}

function createSetStateAction<T>(
    stateOrCallback: StateOrCallback<T>,
    featureKey: string,
    name?: string
): Action {
    const miniRxActionType = MiniRxActionType.SET_STATE;
    return {
        type: createMiniRxActionType(miniRxActionType, featureKey) + (name ? '/' + name : ''),
        stateOrCallback,
        miniRxActionType, // Used to trigger LoggerExtension `beautifyActionForLogging`
    };
}

function createComponentStoreReducer<StateType>(initialState: StateType): Reducer<StateType> {
    return (state: StateType = initialState, action: Action) => {
        return calcNewState(state, action['stateOrCallback']);
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

    if (global.length && local.length) {
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
    } else if (global.length) {
        return global;
    } else {
        return local;
    }
}

export function createComponentStore<T extends object>(
    initialState: T | undefined
): ComponentStore<T> {
    return new ComponentStore<T>(initialState);
}

// TODO
// TEST mergeExtensions
// const global: ComponentStoreExtension[] = [
//     // markAs(new ImmutableStateExtension(), 'global'),
//     // markAs(new UndoExtension(), 'global'),
//     // markAs(new LoggerExtension(), 'global'),
// ];
// const local: ComponentStoreExtension[] = [
//     // markAs(new ImmutableStateExtension(), 'local'),
//     // markAs(new UndoExtension(), 'local'),
//     // markAs(new LoggerExtension(), 'local'),
// ];
//
// console.log(mergeExtensions(global, local));
//
// function markAs(
//     extension: ComponentStoreExtension,
//     globalLocal: 'global' | 'local'
// ): ComponentStoreExtension {
//     extension.test = globalLocal;
//     return extension;
// }
