import { Route } from '@angular/router';
import { ChildComponent } from './child/child.component';
import { provideEffects, provideFeature } from '@mini-rx/signal-store';
import { NxWelcomeComponent } from './nx-welcome.component';
import { counterReducer } from './state';
import { TodoEffects } from './todo.effects';

export const appRoutes: Route[] = [
    {
        path: '',
        component: NxWelcomeComponent,
    },
    {
        path: 'counter',
        component: ChildComponent,
        providers: [provideEffects(TodoEffects), provideFeature('counterFs', counterReducer)],
    },
];
