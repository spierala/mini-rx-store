import {
    configureStore,
    Store,
    LoggerExtension,
    ReduxDevtoolsExtension,
    CommandExtension,
} from 'mini-rx-store';
import { registerUserCmdEffects } from '../users/user-cmd-effects';
import { registerUserEffects } from '../users/user-effects';
import { userReducer, USER_REDUX_SLICE_KEY } from '../users/user-reducer';

export const commandExtension = new CommandExtension();

export const appStore: Store = configureStore({
    reducers: {
        [USER_REDUX_SLICE_KEY]: userReducer,
    },
    extensions: [
        commandExtension,
        new LoggerExtension(),
        new ReduxDevtoolsExtension({
            name: 'MiniRx Showcase',
            maxAge: 25,
            latency: 1000,
        }),
    ],
});

registerUserEffects(appStore);
registerUserCmdEffects(commandExtension);
