import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Action, ActionWithPayload, AppState, Reducer } from './models';
import StoreCore from './store-core';
import { createActionTypePrefix, miniRxError, select } from './utils';
import { createFeatureSelector } from './selector';
import { isUndoExtensionInitialized, undo } from './extensions/undo.extension';

type SetStateFn<StateType> = (state: StateType) => Partial<StateType>;
type StateOrCallback<StateType> = Partial<StateType> | SetStateFn<StateType>;

const nameUpdateAction = 'set-state';

export class FeatureStore<StateType> {
    private readonly actionTypeSetState: string; // E.g. @mini-rx/products/set-state

    state$: BehaviorSubject<StateType> = new BehaviorSubject(undefined);

    get state(): StateType {
        return this.state$.getValue();
    }

    constructor(private featureName: string, initialState: StateType) {
        const actionTypePrefix = createActionTypePrefix(featureName);
        const reducer: Reducer<StateType> = createDefaultReducer(actionTypePrefix, initialState);
        StoreCore.addFeature<StateType>(featureName, reducer, {
            isDefaultReducer: true,
        });

        // Create Default Action Type (needed for setState())
        this.actionTypeSetState = `${actionTypePrefix}/${nameUpdateAction}`;

        // Select Feature State and delegate to local BehaviorSubject
        const featureSelector = createFeatureSelector<AppState, StateType>(featureName);
        StoreCore.select(featureSelector).subscribe(this.state$);
    }

    setState(stateOrCallback: StateOrCallback<StateType>, name?: string): Action {
        const action: ActionWithPayload = {
            type: name ? this.actionTypeSetState + '/' + name : this.actionTypeSetState,
            payload:
                typeof stateOrCallback === 'function'
                    ? stateOrCallback(this.state)
                    : stateOrCallback,
        };

        StoreCore.dispatch(action, { onlyForFeature: this.featureName });

        return action;
    }

    select(): Observable<StateType>;
    select<K>(mapFn: (state: StateType) => K): Observable<K>;
    select<K, T extends (state: StateType) => K>(mapFn?: T): Observable<K | StateType> {
        if (!mapFn) {
            return this.state$;
        }
        return this.state$.pipe(select(mapFn));
    }

    effect<PayLoadType = any>(
        effectFn: (payload: Observable<PayLoadType>) => Observable<any>
    ): (payload?: PayLoadType) => void {
        const subject: Subject<PayLoadType> = new Subject();

        subject.pipe(effectFn).subscribe();

        return (payload?: PayLoadType) => {
            subject.next(payload);
        };
    }

    undo(action: Action) {
        isUndoExtensionInitialized
            ? StoreCore.dispatch(undo(action))
            : miniRxError('UndoExtension is not initialized');
    }
}

function createDefaultReducer<StateType>(
    nameSpaceFeature: string,
    initialState: StateType
): Reducer<StateType> {
    return (state: StateType = initialState, action: ActionWithPayload) => {
        // Check for 'set-state' action (originates from FeatureStore.setState())
        if (
            action.type.indexOf(nameSpaceFeature) > -1 &&
            action.type.indexOf(nameUpdateAction) > -1
        ) {
            return {
                ...state,
                ...action.payload,
            };
        }
        return state;
    };
}
