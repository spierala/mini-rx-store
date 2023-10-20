import { createReducerManager } from './reducer-manager';
import { Action, AppState, MetaReducer, Reducer } from './models';

type CounterState = { counter: number };

type CounterStringState = { counter: string };

interface ActionWithPayload extends Action {
    payload?: any;
}

const counterReducer: Reducer<CounterState> = (state = { counter: 1 }, action: Action) => {
    switch (action.type) {
        case 'inc':
            return {
                ...state,
                counter: state.counter + 1,
            };
        default:
            return state;
    }
};

const counterStringReducer: Reducer<CounterStringState> = (
    state = { counter: '1' },
    action: ActionWithPayload
) => {
    switch (action.type) {
        case 'inc':
            return {
                ...state,
                counter: state.counter + action.payload,
            };
        default:
            return state;
    }
};

describe('createReducerManager', () => {
    it('should set feature reducers', () => {
        const manager = createReducerManager();
        let nextState: AppState;
        let reducer: Reducer<AppState>;

        manager.setFeatureReducers({
            feature1: counterReducer,
            feature2: counterReducer,
            feature3: counterReducer,
        });

        manager.getReducerObservable().subscribe((v) => {
            reducer = v;
        });

        nextState = reducer!({}, { type: 'init' });
        expect(nextState).toEqual({
            feature1: { counter: 1 },
            feature2: { counter: 1 },
            feature3: { counter: 1 },
        });

        nextState = reducer!({}, { type: 'inc' });
        expect(nextState).toEqual({
            feature1: { counter: 2 },
            feature2: { counter: 2 },
            feature3: { counter: 2 },
        });
    });

    it('should add feature reducers', () => {
        const manager = createReducerManager();
        let nextState: AppState;
        let reducer: Reducer<AppState>;

        manager.addFeatureReducer('feature1', counterReducer);
        manager.addFeatureReducer('feature2', counterReducer);

        manager.getReducerObservable().subscribe((v) => {
            reducer = v;
        });

        nextState = reducer!({}, { type: 'init' });
        expect(nextState).toEqual({
            feature1: { counter: 1 },
            feature2: { counter: 1 },
        });

        nextState = reducer!({}, { type: 'inc' });
        expect(nextState).toEqual({
            feature1: { counter: 2 },
            feature2: { counter: 2 },
        });
    });

    it('should remove feature reducers', () => {
        const manager = createReducerManager();
        let nextState: AppState;
        let reducer: Reducer<AppState>;

        manager.setFeatureReducers({
            feature1: counterReducer,
            feature2: counterReducer,
            feature3: counterReducer,
        });

        manager.getReducerObservable().subscribe((v) => {
            reducer = v;
        });

        nextState = reducer!({}, { type: 'init' });
        expect(nextState).toEqual({
            feature1: { counter: 1 },
            feature2: { counter: 1 },
            feature3: { counter: 1 },
        });

        manager.removeFeatureReducer('feature2');

        nextState = reducer!({}, { type: 'abc' }); // Any action triggers the recalculation of state
        expect(nextState).toEqual({
            feature1: { counter: 1 },
            feature3: { counter: 1 },
        });
    });

    it('should add meta reducers', () => {
        const metaReducer: MetaReducer<AppState> = (reducer) => {
            return (state, action) => {
                if (action.type === 'inc') {
                    state = {
                        ...state,
                        feature1: {
                            ...state['feature1'],
                            counter: state['feature1'].counter + '2',
                        },
                    };
                }
                return reducer(state, action);
            };
        };

        const metaReducerForFeature: MetaReducer<CounterStringState> = (reducer) => {
            return (state, action) => {
                if (action.type === 'inc') {
                    state = {
                        ...state,
                        counter: state.counter + '3',
                    };
                }
                return reducer(state, action);
            };
        };

        const manager = createReducerManager();

        manager.addFeatureReducer('feature1', counterStringReducer, [metaReducerForFeature]);
        manager.addMetaReducers(metaReducer);

        let reducer: Reducer<AppState>;
        let nextState: AppState;

        manager.getReducerObservable().subscribe((v) => {
            reducer = v;
        });

        nextState = reducer!({}, { type: 'init' });
        nextState = reducer!(nextState, { type: 'inc', payload: '4' });

        expect(nextState).toEqual({
            feature1: {
                counter: '1234', // '1' from initial state, '2' from meta reducer, '3' from feature  meta reducer, '4' from feature reducer
            },
        });
    });

    it('should throw if feature already exists', () => {
        const manager = createReducerManager();

        manager.setFeatureReducers({
            feature1: counterReducer,
        });

        expect(() => manager.addFeatureReducer('feature1', (state) => state)).toThrowError(
            '@mini-rx: Feature "feature1" already exists.'
        );
    });

    it('should should add initial state to feature reducer', () => {
        const manager = createReducerManager();

        const reducerWithoutInitialState: Reducer<CounterState> = (state) => {
            return state;
        };

        manager.addFeatureReducer('feature1', reducerWithoutInitialState, undefined, {
            counter: 1,
        });

        let reducer: Reducer<AppState>;

        manager.getReducerObservable().subscribe((v) => {
            reducer = v;
        });

        const nextState = reducer!({}, { type: 'init' });

        expect(nextState).toEqual({
            feature1: {
                counter: 1,
            },
        });
    });
});
