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
import { environment } from '../environments/environment';
import { ImmutableStateExtension, LoggerExtension, UndoExtension } from 'mini-rx-store';

// Store Extensions
// if (!environment.production) {
//     store.addExtension(new ImmutableStateExtension());
//     store.addExtension(new LoggerExtension());
//     store.addExtension(new UndoExtension());
// }

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        HttpClientInMemoryWebApiModule.forRoot(ProductData, { delay: 500 }),
        UserModule,
        AppRoutingModule,
        StoreModule.forRoot(),
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
export class AppModule {}
