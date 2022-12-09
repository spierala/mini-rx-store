import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DbService } from './api/db.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { TodosModule } from './modules/todos/todos.module';
import { CounterModule } from './modules/counter/counter.module';
import { StoreDevtoolsModule, StoreModule } from 'mini-rx-store-ng';
import {
    ImmutableStateExtension,
    LoggerExtension,
    UndoExtension,
    FeatureStore,
    ComponentStore,
    createFeatureStore,
    createComponentStore,
} from 'mini-rx-store';
import { ProductsStateModule } from './modules/products/state/products-state.module';
import { UserModule } from './modules/user/user.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { initialState, TodosState } from './modules/todos/state/todos-store.service';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientInMemoryWebApiModule.forRoot(DbService, { delay: 500, put204: false }),
        AppRoutingModule,
        ToastrModule.forRoot(),
        TodosModule,
        CounterModule,
        UserModule,
        StoreModule.forRoot({
            extensions: [new ImmutableStateExtension(), new UndoExtension(), new LoggerExtension()],
        }),
        // TODO exclude from production: https://ngrx.io/guide/store-devtools/recipes/exclude
        StoreDevtoolsModule.instrument({
            name: 'MiniRx Angular Demo',
            maxAge: 25,
            latency: 250,
            trace: true,
            traceLimit: 25,
        }),
        ProductsStateModule,
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AppModule {
    // constructor() {
    //     const fs = new ComponentStore<TodosState>();
    //
    //     //  fs.setState({ todos: [] });
    //
    //     const fsState$ = fs.select();
    //     fsState$.subscribe((v) => console.log('# test', v));
    //
    //     // Test lazy initialization
    //     setTimeout(() => {
    //         fs.setInitialState(initialState);
    //     }, 5000);
    //
    //     setTimeout(() => {
    //         // Use setState as usual
    //         fs.setState((state) => {
    //             //  state.todos = [];
    //             return {
    //                 todos: [{ id: 123, title: 'test', isDone: false }],
    //             };
    //         });
    //     }, 6000);
    //
    //     const fs2 = createFeatureStore<TodosState>('blabla', initialState);
    //     const fs3 = createComponentStore<TodosState>(initialState);
    //
    //     fs2.setState((state) => {
    //         return { todos: [] };
    //     });
    //
    //     // fs2.setInitialState(initialState);
    // }
}
