import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Action, AppState, Reducer } from './models';
import StoreCore from './store-core';
import { createActionTypePrefix, miniRxError } from './utils';
import { createFeatureSelector, createSelector, Selector } from './selector';
import { isUndoExtensionInitialized, undo } from './extensions/undo.extension';

type SetStateFn<StateType> = (state: StateType) => Partial<StateType>;
type StateOrCallback<StateType> = Partial<StateType> | SetStateFn<StateType>;

export const nameUpdateAction = 'set-state';

export class FeatureStore<StateType> {
    private readonly actionTypeSetState: string; // E.g. @mini-rx/products/set-state
    private readonly featureSelector: Selector<AppState, StateType>;

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

        this.featureSelector = createFeatureSelector<StateType>(featureName);

        // Select Feature State and delegate to local BehaviorSubject
        StoreCore.select(this.featureSelector).subscribe(this.state$);
    }

    setState(stateOrCallback: StateOrCallback<StateType>, name?: string): Action {
        const action: Action = {
            type: name ? this.actionTypeSetState + '/' + name : this.actionTypeSetState,
            payload:
                typeof stateOrCallback === 'function'
                    ? stateOrCallback(this.state)
                    : stateOrCallback,
        };

        StoreCore.dispatch(action, { onlyForFeature: this.featureName });

        return action;
    }

    select<K>(mapFn: (state: StateType) => K, selectFromStore?: boolean): Observable<K>;
    select<K>(mapFn: (state: AppState) => K, selectFromStore?: boolean): Observable<K>;
    select<K, T extends (state: AppState | StateType) => K>(
        mapFn: T,
        selectFromStore: boolean = false
    ): Observable<K> {
        if (selectFromStore) {
            return StoreCore.select(mapFn);
        }

        const selector = createSelector(this.featureSelector, mapFn);

        return StoreCore.select(selector);
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
    return (state: StateType = initialState, action: Action) => {
        // Check for 'set-state' action (originates from Feature.setState())
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
