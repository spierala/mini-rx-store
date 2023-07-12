import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { Store } from '@mini-rx/signal-store';

@Component({
    standalone: true,
    imports: [NxWelcomeComponent, RouterModule],
    selector: 'mini-rx-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'signal-store-angular-demo-standalone';

    store = inject(Store);
}
