import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Action, AppState, MetaReducer, Reducer } from './interfaces';
import StoreCore from './store-core';
import { createActionTypePrefix } from './utils';
import { createFeatureSelector, createSelector, Selector } from './selector';

type SetStateFn<StateType> = (state: StateType) => Partial<StateType>;
type StateOrCallback<StateType> = Partial<StateType> | SetStateFn<StateType>;

export const nameUpdateAction = 'SET-STATE';

export abstract class Feature<StateType> {
    private readonly actionTypePrefix: string; // E.g. @mini-rx/products
    private readonly actionTypeSetState: string; // E.g. @mini-rx/products/SET-STATE
    private readonly featureSelector: Selector<AppState, StateType>;

    protected state$: BehaviorSubject<StateType> = new BehaviorSubject(undefined);
    get state(): StateType {
        return this.state$.getValue();
    }

    protected constructor(
        private featureName: string,
        initialState: StateType
    ) {
        const actionTypePrefix = createActionTypePrefix(featureName);
        const reducer: Reducer<StateType> = createDefaultReducer(actionTypePrefix, initialState);
        StoreCore.addFeature<StateType>(featureName, reducer, {
            isDefaultReducer: true
        });

        this.actionTypePrefix = actionTypePrefix;

        // Create Default Action Type (needed for setState())
        this.actionTypeSetState = `${this.actionTypePrefix}/${nameUpdateAction}`;

        this.featureSelector = createFeatureSelector<StateType>(featureName);

        // Select Feature State and delegate to local BehaviorSubject
        StoreCore.select(this.featureSelector).subscribe(this.state$);
    }

    protected setState(stateOrCallback: StateOrCallback<StateType>, name?: string): void {
        StoreCore.dispatch(
            {
                type: name ? this.actionTypeSetState + '/' + name : this.actionTypeSetState,
                payload: stateOrCallback,
            },
            { onlyForFeature: this.featureName }
        );
    }

    protected select<K>(mapFn: (state: StateType) => K, selectFromStore?: boolean): Observable<K>;
    protected select<K>(mapFn: (state: AppState) => K, selectFromStore?: boolean): Observable<K>;
    protected select<K, T extends (state: AppState | StateType) => K>(
        mapFn: T,
        selectFromStore: boolean = false
    ): Observable<K> {
        if (selectFromStore) {
            return StoreCore.select(mapFn);
        }

        const selector = createSelector(this.featureSelector, mapFn);

        return StoreCore.select(selector);
    }

    protected createEffect<PayLoadType = any>(
        effectFn: (payload: Observable<PayLoadType>) => Observable<any>
    ): (payload?: PayLoadType) => void {
        const subject: Subject<PayLoadType> = new Subject();

        subject.pipe(effectFn).subscribe();

        return (payload?: PayLoadType) => {
            subject.next(payload);
        };
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
            const stateOrCallback: StateOrCallback<StateType> = action.payload;
            const newState: Partial<StateType> =
                typeof stateOrCallback === 'function' ? stateOrCallback(state) : stateOrCallback; // TODO Undo

            return {
                ...state,
                ...newState,
            };
        }
        return state;
    };
}
