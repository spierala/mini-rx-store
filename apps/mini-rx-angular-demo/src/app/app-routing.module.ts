import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { CounterShellComponent } from './modules/counter/counter-shell/counter-shell.component';
import { UserShellComponent } from './modules/user/components/user-shell/user-shell.component';
import { PixelArtShellComponent } from './modules/pixel-art/components/pixel-art-shell/pixel-art-shell.component';

const appRoutes: Routes = [
    {
        path: 'todos-simple',
        loadChildren: () =>
            import('./modules/todos-simple/todos-simple.module').then((m) => m.TodosSimpleModule),
    },
    {
        path: 'todos',
        loadChildren: () => import('./modules/todos/todos.module').then((m) => m.TodosModule),
    },
    {
        path: 'products',
        loadChildren: () =>
            import('./modules/products/products.module').then((m) => m.ProductsModule),
    },
    {
        path: 'counter',
        component: CounterShellComponent,
    },
    {
        path: 'cart',
        loadChildren: () => import('./modules/cart/cart.module').then((m) => m.CartModule),
    },
    {
        path: 'art',
        component: PixelArtShellComponent,
    },
    {
        path: 'user',
        component: UserShellComponent,
    },
    { path: '', redirectTo: 'todos-simple', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {})],
    exports: [RouterModule],
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
})
export class AppRoutingModule {}
