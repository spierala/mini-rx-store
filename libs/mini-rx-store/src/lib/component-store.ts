import { BaseStore } from './base-store';
import {
    Action,
    ComponentStoreConfig,
    ComponentStoreExtension,
    HasComponentStoreSupport,
    MetaReducer,
    Reducer,
    StateOrCallback,
    StoreExtension,
} from './models';
import { calcNewState, miniRxError } from './utils';
import { queueScheduler, Subject } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { createMiniRxActionType, MiniRxActionType } from './actions';
import { combineMetaReducers } from './store-core';
import { undo, UndoExtension } from './extensions/undo.extension';
import { ImmutableStateExtension } from './extensions/immutable-state.extension';
import { LoggerExtension } from './extensions/logger.extension';

// TODO do not use Class for logging
class InitStoreAction implements Action {
    type = createMiniRxActionType(MiniRxActionType.INIT_COMPONENT_STORE);
    constructor(public stateOrCallback: StateOrCallback<any>) {}
}

// TODO do not use Class for logging
class SetStateAction implements Action {
    type = createMiniRxActionType(MiniRxActionType.SET_STATE, 'component-store');
    constructor(public stateOrCallback: StateOrCallback<any>) {}
}

let componentStoreConfig: ComponentStoreConfig | undefined = undefined;

export function configureComponentStores(config: { extensions: ComponentStoreExtension[] }) {
    if (!componentStoreConfig) {
        componentStoreConfig = config;
        return;
    }
    miniRxError('`configureComponentStores` was called multiple times.');
}

export class ComponentStore<StateType extends object> extends BaseStore<StateType> {
    private actionsSource = new Subject<Action>();
    private reducer: Reducer<StateType> = (state, action: Action) => {
        return calcNewState(state, action['stateOrCallback']);
    };

    constructor(
        initialState?: StateType,
        config?: { extensions: (StoreExtension & HasComponentStoreSupport)[] }
    ) {
        super();

        const metaReducers: MetaReducer<StateType>[] = [];
        let extensions: ComponentStoreExtension[] = [];

        if (config?.extensions) {
            if (config.extensions && componentStoreConfig?.extensions) {
                extensions = mergeExtensions(componentStoreConfig.extensions, config.extensions);
            } else {
                extensions = config.extensions;
            }
        }

        extensions.forEach((ext) => {
            // TODO add runtime check to see if initForCs exists?
            metaReducers.push(ext.initForCs());
        });

        const combinedMetaReducer: MetaReducer<StateType> = combineMetaReducers(metaReducers);
        const reducer = combinedMetaReducer(this.reducer);

        this.sub.add(
            this.actionsSource
                .pipe(
                    observeOn(queueScheduler) // Prevent stack overflow: https://blog.cloudboost.io/so-how-does-rx-js-queuescheduler-actually-work-188c1b46526e
                )
                .subscribe((action) => {
                    const newState: StateType = reducer(this.stateSource.getValue()!, action); // TODO check if (!) is OK here, currentState can be undefined!
                    this.stateSource.next(newState);
                })
        );

        if (initialState) {
            this.setInitialState(initialState);
        }
    }

    override setInitialState(initialState: StateType): void {
        super.setInitialState(initialState);

        this.dispatch(new InitStoreAction(initialState));
    }

    override setState(stateOrCallback: StateOrCallback<StateType>, name?: string): Action {
        super.setState(stateOrCallback, name);

        const action: Action = new SetStateAction(stateOrCallback);
        this.dispatch(action);
        return action;
    }

    private dispatch(action: Action) {
        this.actionsSource.next(action);
    }

    undo(action: Action) {
        // TODO check if extension exists
        this.dispatch(undo(action));
    }
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
    initialState: T | undefined
): ComponentStore<T> {
    return new ComponentStore<T>(initialState);
}

// TODO
// TEST mergeExtensions
const global: ComponentStoreExtension[] = [
    markAs(new ImmutableStateExtension(), 'global'),
    // markAs(new UndoExtension(), 'global'),
    markAs(new LoggerExtension(), 'global'),
];
const local: ComponentStoreExtension[] = [
    // markAs(new ImmutableStateExtension(), 'local'),
    markAs(new UndoExtension(), 'local'),
    markAs(new LoggerExtension(), 'local'),
];

console.log(mergeExtensions(global, local));

function markAs(
    extension: ComponentStoreExtension,
    globalLocal: 'global' | 'local'
): ComponentStoreExtension {
    extension.test = globalLocal;
    return extension;
}
