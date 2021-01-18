import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ProductData } from './products/product-data';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ShellComponent } from './home/shell.component';
import { MenuComponent } from './home/menu.component';
import { WelcomeComponent } from './home/welcome.component';
import { PageNotFoundComponent } from './home/page-not-found.component';
import { UserModule } from './user/user.module';
import { NgReduxDevtoolsModule, StoreModule } from 'mini-rx-store-ng';
import {
    Action,
    ImmutableStateExtension,
    LoggerExtension,
    Store,
    UndoExtension,
} from 'mini-rx-store';
import { MetaReducer } from '../../../mini-rx-store/src/lib/models';

export interface CounterState {
    counter: number;
}

export const counterInitialState: CounterState = {
    counter: 1,
};

export function counterReducer(state: CounterState, action: Action) {
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

const reducer = (state, action) => {
    return state;
};

const metaReducer: MetaReducer<any> = (reducer) => {
    return (state, action) => {
        const nextState = reducer(state, action);
        return nextState;
    };
};

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        HttpClientInMemoryWebApiModule.forRoot(ProductData, { delay: 500 }),
        // UserModule,
        AppRoutingModule,
        StoreModule.forRoot({
            // initialState: {
            //     test: {
            //         prop1: 'val1'
            //     },
            // },
            reducers: {
                test: reducer,
            },
            // metaReducers: [metaReducer],
            extensions: [new LoggerExtension()],
        }),
        StoreModule.forFeature('feature', counterReducer, {
            initialState: counterInitialState,
        }),
        NgReduxDevtoolsModule.instrument({
            name: 'MiniRx Redux Showcase',
            maxAge: 25,
            latency: 250,
        }),
    ],
    declarations: [
        AppComponent,
        ShellComponent,
        MenuComponent,
        WelcomeComponent,
        PageNotFoundComponent,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(store: Store) {
        store.select((state) => state).subscribe((value) => console.log('####', value));

        setTimeout(() => {
            store.dispatch({ type: 'bla' });
            store.dispatch({ type: 'bla' });
            store.dispatch({ type: 'bla' });
        }, 2000);
    }
}
