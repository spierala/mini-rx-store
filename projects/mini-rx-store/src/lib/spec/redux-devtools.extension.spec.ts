import Store from '../store';
import { ReduxDevtoolsExtension } from '../redux-devtools.extension';
import { counterInitialState, counterReducer, CounterState } from './store.spec';
import { Action } from '../interfaces';

const win = window as any;

describe('Redux Dev Tools', () => {
    beforeEach(() => {
        Store.feature<CounterState>('counter4',  counterInitialState, counterReducer);
    });
    it('should receive state and actions', () => {
        const action: Action = {type: 'counter'};
        const sendFn = jest.fn();

        win.__REDUX_DEVTOOLS_EXTENSION__ = {
            connect: () => {
                return {
                    subscribe: () => {

                    },
                    send: sendFn
                };
            }
        };

        Store.addExtension(new ReduxDevtoolsExtension({name: 'test'}));
        Store.dispatch(action);

        let currAppState;

        Store.select(state => state).subscribe(state => currAppState = state);

        expect(sendFn).toHaveBeenCalledTimes(1);
        expect(sendFn).toHaveBeenCalledWith(action, {
            ...currAppState,
            counter4: {counter: 2}
        });
    });
});
