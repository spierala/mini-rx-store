import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: 'todos-simple',
        loadChildren: () => import('./todos-simple/routes').then(({ routes }) => routes),
    },
    {
        path: 'todos',
        loadChildren: () => import('./todos/routes').then(({ routes }) => routes),
    },
    {
        path: 'products',
        loadChildren: () => import('./products/routes').then(({ routes }) => routes),
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
