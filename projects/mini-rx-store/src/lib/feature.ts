import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AppState } from './interfaces';
import StoreCore from './store-core';
import { createActionTypePrefix, isFunction, nameUpdateAction } from './utils';
import { createFeatureSelector, createSelector, Selector } from './selector';

type SetStateFn<StateType> = (state: StateType) => Partial<StateType> | void;
type StateOrCallback<StateType> = Partial<StateType> | SetStateFn<StateType>;
type ProducerFn = (state: any, fn: any) => any;

interface FeatureConfig {
    producerFn: ProducerFn;
}

export abstract class Feature<StateType> {
    private readonly actionTypePrefix: string; // E.g. @mini-rx/products
    private readonly actionTypeSetState: string; // E.g. @mini-rx/products/SET-STATE
    private readonly featureSelector: Selector<AppState, StateType>;

    protected state$: BehaviorSubject<StateType> = new BehaviorSubject(undefined);
    get state(): StateType {
        return this.state$.getValue();
    }

    private get producerFn(): ProducerFn {
        return this.config.producerFn;
    }

    protected constructor(
        featureName: string,
        initialState: StateType,
        private config: Partial<FeatureConfig> = {}
    ) {
        StoreCore.addFeature<StateType>(featureName, initialState);

        this.actionTypePrefix = createActionTypePrefix(featureName);

        // Create Default Action Type (needed for setState())
        this.actionTypeSetState = `${this.actionTypePrefix}/${nameUpdateAction}`;

        this.featureSelector = createFeatureSelector<StateType>(featureName);

        // Select Feature State and delegate to local BehaviorSubject
        StoreCore.select(this.featureSelector).subscribe(this.state$);
    }

    protected setState(stateOrCallback: StateOrCallback<StateType>, name?: string): void {
        let newState: Partial<StateType>;
        if (isFunction(stateOrCallback)) {
            newState = isFunction(this.producerFn) ? this.producerFn(this.state, stateOrCallback) : stateOrCallback(this.state);
        } else {
            newState = stateOrCallback;
        }

        StoreCore.dispatch({
            type: name ? this.actionTypeSetState + '/' + name : this.actionTypeSetState,
            payload: newState
        });
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

        const selector = createSelector(
            this.featureSelector,
            mapFn
        );

        return StoreCore.select(selector);
    }

    protected createEffect<PayLoadType = any>(
        effectFn: (payload: Observable<PayLoadType>) => Observable<any>
    ): (payload?: PayLoadType) => void {
        const subject: Subject<PayLoadType> = new Subject();

        subject.pipe(
            effectFn
        ).subscribe();

        return (payload?: PayLoadType) => {
            subject.next(payload);
        };
    }
}
