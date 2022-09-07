import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodosShellComponent } from './modules/todos/components/todos-shell/todos-shell.component';
import { APP_BASE_HREF } from '@angular/common';
import { CounterShellComponent } from './modules/counter/counter-shell/counter-shell.component';
import { UserShellComponent } from './modules/user/components/user-shell/user-shell.component';

const appRoutes: Routes = [
    {
        path: 'todos',
        component: TodosShellComponent,
    },
    {
        path: 'todos-simple',
        loadChildren: () =>
            import('./modules/todos-simple/todos-simple.module').then((m) => m.TodosSimpleModule),
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
    { path: '', redirectTo: 'todos', pathMatch: 'full' },
    {
        path: 'cart',
        loadChildren: () => import('./modules/cart/cart.module').then((m) => m.CartModule),
    },
    {
        path: 'user',
        component: UserShellComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule],
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
})
export class AppRoutingModule {}
