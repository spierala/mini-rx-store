import { BaseStore } from './base-store';
import { Action, MetaReducer, Reducer, StateOrCallback, StoreExtension } from './models';
import { calcNewState } from './utils';
import { queueScheduler, Subject } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { createMiniRxActionType, MiniRxActionType } from './actions';
import { combineMetaReducers } from './store-core';
import { undo } from './extensions/undo.extension';

class InitStoreAction implements Action {
    type = createMiniRxActionType(MiniRxActionType.INIT_STORE);
    constructor(public stateOrCallback: StateOrCallback<any>) {}
}

class SetStateAction implements Action {
    type = createMiniRxActionType(MiniRxActionType.SET_STATE);
    constructor(public stateOrCallback: StateOrCallback<any>) {}
}

type ComponentStoreActions = InitStoreAction | SetStateAction;

export class ComponentStore<StateType extends object> extends BaseStore<StateType> {
    private actionsSource = new Subject<Action>();
    private reducer: Reducer<StateType> = (state, action: Action) => {
        return calcNewState(state, action['stateOrCallback']);
    };

    constructor(
        protected override initialState?: StateType,
        config?: { extensions: StoreExtension[] }
    ) {
        super(initialState);

        const metaReducers: MetaReducer<StateType>[] = [];

        config?.extensions.forEach((ext) => {
            if (ext.metaReducer) {
                metaReducers.push(ext.metaReducer);
            }
        });

        const combinedMetaReducer: MetaReducer<StateType> = combineMetaReducers(metaReducers);
        const reducer = combinedMetaReducer(this.reducer);

        this.sub.add(
            this.actionsSource
                .pipe(
                    observeOn(queueScheduler) // Prevent stack overflow: https://blog.cloudboost.io/so-how-does-rx-js-queuescheduler-actually-work-188c1b46526e
                )
                .subscribe((action) => {
                    const newState: StateType = reducer(this.stateSource.getValue()!, action);
                    this.updateState(newState);
                })
        );
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

    private updateState(state: StateType) {
        this.stateSource.next(state);
    }

    undo(action: Action) {
        // TODO check if extension exists
        this.dispatch(undo(action));
    }
}

export function createComponentStore<T extends object>(
    initialState: T | undefined
): ComponentStore<T> {
    return new ComponentStore<T>(initialState);
}
