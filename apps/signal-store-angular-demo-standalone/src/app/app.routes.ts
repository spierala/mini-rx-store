import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: 'todos-simple',
        loadComponent: () =>
            import(
                './todos-simple/components/todos-simple-shell/todos-simple-shell.component'
            ).then((v) => v.TodosSimpleShellComponent),
    },
    {
        path: 'todos',
        loadComponent: () =>
            import('./todos/components/todos-shell/todos-shell.component').then(
                (v) => v.TodosShellComponent
            ),
    },
    {
        path: 'products',
        loadComponent: () =>
            import('./products/components/products-shell/products-shell.component').then(
                (v) => v.ProductsShellComponent
            ),
    },
    {
        path: 'counters',
        loadComponent: () =>
            import('./counters/counter-shell/counter-shell.component').then(
                (v) => v.CounterShellComponent
            ),
    },
    {
        path: 'art',
        loadComponent: () =>
            import('./pixel-art/components/pixel-art-shell/pixel-art-shell.component').then(
                (v) => v.PixelArtShellComponent
            ),
    },
    {
        path: 'user',
        loadComponent: () =>
            import('./user/components/user-shell/user-shell.component').then(
                (v) => v.UserShellComponent
            ),
    },
    {
        path: 'cart',
        loadComponent: () =>
            import('./cart/components/cart-shell/cart-shell.component').then(
                (v) => v.CartShellComponent
            ),
    },
    { path: '', redirectTo: 'todos-simple', pathMatch: 'full' },
];
