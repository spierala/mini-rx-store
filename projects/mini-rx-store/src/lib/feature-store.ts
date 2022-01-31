import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Action, ActionWithPayload, AppState, Reducer } from './models';
import StoreCore from './store-core';
import { createMiniRxAction, miniRxError, select } from './utils';
import { createFeatureSelector, createSelector } from './selector';
import { isUndoExtensionInitialized, undo } from './extensions/undo.extension';
import { defaultEffectsErrorHandler } from './default-effects-error-handler';

type SetStateFn<StateType> = (state: StateType) => Partial<StateType>;
type StateOrCallback<StateType> = Partial<StateType> | SetStateFn<StateType>;

export class FeatureStore<StateType extends object> {
    private readonly setStateAction: Action; // E.g. {type: '@mini-rx/set-state/products'}

    private stateSource: BehaviorSubject<StateType> = new BehaviorSubject(undefined);
    state$: Observable<StateType> = this.stateSource.asObservable();
    get state(): StateType {
        return this.stateSource.getValue();
    }

    // tslint:disable-next-line:variable-name
    private readonly _featureKey: string;
    get featureKey(): string {
        return this._featureKey;
    }

    private sub: Subscription;

    private readonly keys: string[];

    constructor(featureKey: string, initialState: StateType, private config?: { multi: boolean }) {
        this._featureKey = featureKey;

        this.keys = StoreCore.addFeatureStore<StateType>(featureKey, initialState, config.multi);
        this.setStateAction = createMiniRxAction('set-state', this.keys);

        const featureStateSelector = createSelector(
            createFeatureSelector<AppState, StateType>(this.keys[0]),
            (state) => {
                if (this.keys.length > 1) {
                    return state[this.keys[1]];
                }
                return state;
            }
        );

        // Select Feature State and delegate to local BehaviorSubject
        this.sub = StoreCore.select(featureStateSelector).subscribe(this.stateSource);
    }

    setState(stateOrCallback: StateOrCallback<StateType>, name?: string): Action {
        const action: ActionWithPayload = {
            type: this.setStateAction.type + (name ? '/' + name : ''),
            payload: stateOrCallback,
        };

        StoreCore.dispatch(action);

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
        const effectWithDefaultErrorHandler = defaultEffectsErrorHandler(subject.pipe(effectFn));

        this.sub.add(effectWithDefaultErrorHandler.subscribe());

        return (payload?: PayLoadType) => {
            subject.next(payload);
        };
    }

    undo(action: Action) {
        isUndoExtensionInitialized
            ? StoreCore.dispatch(undo(action))
            : miniRxError('UndoExtension is not initialized.');
    }

    destroy() {
        this.sub.unsubscribe();
        StoreCore.removeFeature(this.keys);
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngOnDestroy() {
        this.destroy();
    }
}
