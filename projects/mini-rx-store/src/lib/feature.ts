import { BehaviorSubject, Observable } from 'rxjs';
import { Action, AppState } from './interfaces';
import StoreCore from './store-core';
import { createActionTypePrefix, nameUpdateAction, ofType } from './utils';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { createFeatureSelector } from './selector';

export abstract class Feature<StateType> {
    private readonly actionTypePrefix: string; // E.g. @mini-rx/products
    private readonly actionTypeSetState: string; // E.g. @mini-rx/products/set-state
    private effectCounter = 1; // Used for naming anonymous effects

    protected state$: BehaviorSubject<StateType> = new BehaviorSubject(
        undefined
    );
    get state(): StateType {
        return this.state$.getValue();
    }

    protected constructor(featureName: string, initialState: StateType) {
        StoreCore.addFeature<StateType>(featureName, initialState);

        this.actionTypePrefix = createActionTypePrefix(featureName);

        // Create Default Action Type (needed for setState())
        this.actionTypeSetState = `${this.actionTypePrefix}/${nameUpdateAction}`;

        // Feature State and delegate to local BehaviorSubject
        StoreCore.select(createFeatureSelector(featureName)).subscribe(
            this.state$
        );
    }

    protected setState(
        state: Partial<StateType>,
        name?: string
    ): void {
        StoreCore.dispatch({
            type: name
                ? this.actionTypeSetState + '/' + name
                : this.actionTypeSetState,
            payload:  {...this.state, ...state},
        });
    }

    protected select<K>(
        mapFn: (state: StateType) => K,
        selectFromStore?: boolean
    ): Observable<K>;
    protected select<K>(
        mapFn: (state: AppState) => K,
        selectFromStore?: boolean
    ): Observable<K>;
    protected select<K, T extends (state: AppState | StateType) => K>(
        mapFn: T,
        selectFromStore: boolean = false
    ): Observable<K> {
        if (selectFromStore) {
            return StoreCore.select(mapFn);
        }

        return this.state$.pipe(
            map((state) => mapFn(state)),
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
        ) => Observable<Partial<StateType>>,
        effectName?: string
    ): (payload?: PayLoadType) => void {
        const effectStartActionType = this.getEffectStartActionType(effectName);
        const effect$: Observable<Action> = StoreCore.actions$.pipe(
            ofType(effectStartActionType),
            map((action) => action.payload),
            effectFn,
            map((state: Partial<StateType>) => {
                return {
                    type: effectStartActionType + '/' + nameUpdateAction,
                    payload: {...this.state, ...state},
                };
            })
        );

        StoreCore.createEffect(effect$);

        return (payload?: PayLoadType) => {
            StoreCore.dispatch({
                type: effectStartActionType,
                payload,
            });
        };
    }
}
