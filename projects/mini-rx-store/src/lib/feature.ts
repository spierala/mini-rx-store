import { BehaviorSubject, Observable } from 'rxjs';
import { Action, AppState } from './interfaces';
import { default as Store } from './store-core'; // TODO use StoreCore
import { createActionTypePrefix, nameUpdateAction, ofType } from './utils';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { createFeatureSelector } from './selector';

type SetStateFn<StateType> = (state: StateType) => Partial<StateType>;
type StateOrCallback<StateType> = Partial<StateType> | SetStateFn<StateType>;

export abstract class Feature<StateType> {
    private readonly actionTypePrefix: string; // E.g. @mini-rx/products
    private readonly actionTypeSetState: string; // E.g. @mini-rx/products/set-state
    private effectCounter = 1; // Used for naming anonymous effects

    protected state$: BehaviorSubject<StateType> = new BehaviorSubject(
        undefined
    );
    private get state(): StateType {
        return this.state$.getValue();
    }

    protected constructor(
        featureName: string,
        initialState: StateType
    ) {
        Store.addFeature<StateType>(featureName, initialState);

        this.actionTypePrefix = createActionTypePrefix(featureName);

        // Create Default Action Type (needed for setState())
        this.actionTypeSetState = `${this.actionTypePrefix}/${nameUpdateAction}`;

        // Feature State and delegate to local BehaviorSubject
        Store.select(createFeatureSelector(featureName)).subscribe(this.state$);
    }

    protected setState(
        stateOrCallback: StateOrCallback<StateType>,
        name?: string
    ): void {
        Store.dispatch({
            type: name
                ? this.actionTypeSetState + '/' + name
                : this.actionTypeSetState,
            payload: this.calcNewState(this.state, stateOrCallback),
        });
    }

    protected select<K>(mapFn: (state: StateType | AppState) => K, selectFromStore: boolean = false): Observable<K> {
        if (selectFromStore) {
            return Store.select(mapFn);
        }

        return this.state$.pipe(
            map((state: StateType) => mapFn(state)),
            distinctUntilChanged()
        );
    }

    private getEffectStartActionType(effectName): string {
        if (!effectName) {
            effectName = this.effectCounter;
            this.effectCounter++;
        }
        return `${this.actionTypePrefix}/effect/${effectName}`;
    }

    protected createEffect<PayLoadType = any>(
        effectFn: (
            payload: Observable<PayLoadType>
        ) => Observable<StateOrCallback<StateType>>,
        effectName?: string
    ): (payload?: PayLoadType) => void {
        const effectStartActionType = this.getEffectStartActionType(effectName);
        const effect$: Observable<Action> = Store.actions$.pipe(
            ofType(effectStartActionType),
            map((action) => action.payload),
            effectFn,
            map((stateOrCallback) => {
                return {
                    type: effectStartActionType + '/' + nameUpdateAction,
                    payload: this.calcNewState(this.state, stateOrCallback),
                };
            })
        );

        Store.createEffect(effect$);

        return (payload?: PayLoadType) => {
            Store.dispatch({
                type: effectStartActionType,
                payload,
            });
        };
    }

    private calcNewState(
        state: StateType,
        stateOrCallback: StateOrCallback<StateType>
    ): StateType {
        if (typeof stateOrCallback === 'function') {
            return {
                ...state,
                ...stateOrCallback(state),
            };
        }
        return {
            ...state,
            ...stateOrCallback,
        };
    }
}
