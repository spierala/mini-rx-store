import {
    configureStore,
    Store,
    LoggerExtension,
    ReduxDevtoolsExtension,
    CommandExtension,
} from 'mini-rx-store';
import { registerUserEffects } from '../users/user-effects';
import { userReducer, USER_REDUX_SLICE_KEY } from '../users/user-reducer';

export const appStore: Store = configureStore({
    reducers: {
        [USER_REDUX_SLICE_KEY]: userReducer,
    },
    extensions: [
        new CommandExtension(),
        new LoggerExtension(),
        new ReduxDevtoolsExtension({
            name: 'MiniRx Showcase',
            maxAge: 25,
            latency: 1000,
        }),
    ],
});

registerUserEffects(appStore);
