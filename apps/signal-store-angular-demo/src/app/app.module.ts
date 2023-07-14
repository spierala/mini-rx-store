import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DbService } from './api/db.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { UserModule } from './modules/user/user.module';
import {
    ComponentStoreModule,
    ImmutableStateExtension,
    LoggerExtension,
    ReduxDevtoolsExtension,
    StoreModule,
    UndoExtension,
} from '@mini-rx/signal-store';
import { ProductsStateModule } from './modules/products/state/products-state.module';
import { PixelArtModule } from './modules/pixel-art/pixel-art.module';
import { CounterModule } from './modules/counter/counter.module';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientInMemoryWebApiModule.forRoot(DbService, {
            delay: 500,
            put204: false,
        }),
        AppRoutingModule,
        ToastrModule.forRoot(),
        CounterModule,
        UserModule,

        // TODO exclude extensions (ImmutableStateExtension, LoggerExtension) from production: https://ngrx.io/guide/store-devtools/recipes/exclude
        StoreModule.forRoot({
            extensions: [
                new ImmutableStateExtension(),
                new UndoExtension(),
                new LoggerExtension(),
                new ReduxDevtoolsExtension({
                    name: 'MiniRx Angular Demo',
                    maxAge: 25,
                    latency: 250,
                    trace: true,
                    traceLimit: 25,
                }),
            ],
        }),
        ComponentStoreModule.forRoot({
            extensions: [
                // new LoggerExtension()
            ],
        }),

        ProductsStateModule,
        PixelArtModule,
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
})
export class AppModule {}
