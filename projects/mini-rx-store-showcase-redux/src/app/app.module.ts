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
import { StoreDevtoolsModule, StoreModule } from 'mini-rx-store-ng';
import { ImmutableStateExtension, LoggerExtension, UndoExtension } from 'mini-rx-store';
import { CounterModule } from './counter/counter.module';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        HttpClientInMemoryWebApiModule.forRoot(ProductData, { delay: 500 }),
        UserModule,
        AppRoutingModule,
        StoreModule.forRoot({
            extensions: [new ImmutableStateExtension(), new LoggerExtension(), new UndoExtension()],
        }),
        StoreDevtoolsModule.instrument({
            name: 'MiniRx Redux Showcase',
            maxAge: 25,
            latency: 250,
        }),
        CounterModule,
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
export class AppModule {}
