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
import { NgReduxDevtoolsModule } from '../../../mini-rx-ng-devtools/src/lib/ng-redux-devtools.module';
import { ImmutableStateExtension, LoggerExtension, Store } from 'mini-rx-store';
import { environment } from '../environments/environment';

// Store Extensions
if (!environment.production) {
    Store.addExtension(new ImmutableStateExtension());
    Store.addExtension(new LoggerExtension());
}

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        HttpClientInMemoryWebApiModule.forRoot(ProductData),
        UserModule,
        AppRoutingModule,
        NgReduxDevtoolsModule.instrument({
            name: 'MiniRx Showcase',
            maxAge: 25,
            latency: 1000,
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
