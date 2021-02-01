import { TestBed } from '@angular/core/testing';
import { StoreModule } from '../store.module';
import { Action, Actions, Store } from 'mini-rx-store';
import { StoreExtension } from '../../../../mini-rx-store/src/lib/models';

interface CounterState {
    counter: number;
}

const counterInitialState: CounterState = {
    counter: 1,
};

function counterReducer(state: CounterState = counterInitialState, action: Action) {
    switch (action.type) {
        case 'counter':
            return {
                ...state,
                counter: state.counter + 1,
            };
        default:
            return state;
    }
}

describe(`StoreModule`, () => {
    let store: Store;
    let actions$: Actions;

    const rootMetaReducerSpy = jest.fn();

    function rootMetaReducer(reducer) {
        return (state, action) => {
            rootMetaReducerSpy(state);
            return reducer(state, action);
        };
    }

    const extensionSpy = jest.fn();

    class SomeExtension implements StoreExtension {
        init(): void {
            extensionSpy();
        }
    }

    beforeAll(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({
                    reducers: {
                        counter1: counterReducer,
                        counter2: counterReducer,
                    },
                    initialState: {
                        counter1: { counter: 111 },
                        counter3: {
                            counter: 333,
                        },
                    },
                    metaReducers: [rootMetaReducer],
                    extensions: [new SomeExtension()],
                }),
            ],
        });

        actions$ = TestBed.inject(Actions);
        store = TestBed.inject(Store);
    });

    it(`should provide Store`, () => {
        expect(store).toBeTruthy();
    });

    it(`should initialize Store`, () => {
        const spy = jest.fn();
        store.select((state) => state).subscribe(spy);
        expect(spy).toHaveBeenCalledWith({
            counter1: { counter: 111 }, // Reducer initial state is overwritten by initial state from forRoot config
            counter2: { counter: 1 }, // Reducer initial state
            counter3: { counter: 333 }, // forRoot config initial state
        });
        expect(spy).toHaveBeenCalledTimes(1);

        expect(rootMetaReducerSpy).toHaveBeenCalledTimes(1);
        expect(extensionSpy).toHaveBeenCalledTimes(1);
    });

    it(`should provide Actions`, () => {
        expect(actions$).toBeTruthy();
    });

    it(`should update state`, () => {
        const spy = jest.fn();
        store.dispatch({ type: 'counter' });
        store.select((state) => state).subscribe(spy);

        expect(spy).toHaveBeenCalledWith({
            counter1: { counter: 112 },
            counter2: { counter: 2 },
            counter3: { counter: 333 },
        });
    });
});
