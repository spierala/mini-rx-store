import { ApplicationConfig } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { appRoutes } from './app.routes';
import {
    LoggerExtension,
    provideComponentStoreConfig,
    provideStore,
    ReduxDevtoolsExtension,
    UndoExtension,
} from '@mini-rx/signal-store';
import { counterReducer } from './state';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
        provideStore({
            reducers: {
                counter: counterReducer,
            },
            extensions: [new LoggerExtension(), new ReduxDevtoolsExtension({})],
        }),
        provideComponentStoreConfig({ extensions: [new LoggerExtension(), new UndoExtension()] }),
        // provideEffects([TodoEffects])
    ],
};
