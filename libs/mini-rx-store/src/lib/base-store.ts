import { Observable, Subscription } from 'rxjs';
import { miniRxError } from '@mini-rx/common';
import { State } from './state';

// BaseStore is extended by ComponentStore/FeatureStore
export abstract class BaseStore<StateType extends object> {
    /**
     * @internal Used by ComponentStore/FeatureStore
     */
    protected _sub: Subscription = new Subscription();
    /**
     * @internal Used by ComponentStore/FeatureStore
     */
    protected _state = new State<StateType>();
    /** @deprecated Use the `select` method without arguments */
    state$: Observable<StateType> = this._state.select();
    get state(): StateType {
        this.assertStateIsInitialized();
        return this._state.get()!;
    }
    private isStateInitialized = false;
    private notInitializedErrorMessage =
        `${this.constructor.name} has no initialState yet. ` +
        `Please provide an initialState before updating/getting state.`;
    private initializedErrorMessage = `${this.constructor.name} has initialState already.`;

    // Called by ComponentStore/FeatureStore
    setInitialState(initialState: StateType): void {
        this.assertStateIsNotInitialized();
        this.isStateInitialized = true;
        // Update state happens in ComponentStore/FeatureStore
    }

    protected assertStateIsInitialized(): void {
        if (!this.isStateInitialized) {
            miniRxError(this.notInitializedErrorMessage);
        }
    }

    private assertStateIsNotInitialized(): void {
        if (this.isStateInitialized) {
            miniRxError(this.initializedErrorMessage);
        }
    }

    select = this._state.select.bind(this._state);

    destroy() {
        this._sub.unsubscribe();
    }

    /**
     * @internal
     * Can be called by Angular if ComponentStore/FeatureStore is provided in a component
     */
    ngOnDestroy() {
        this.destroy();
    }
}
