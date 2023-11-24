import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createComponentStore, Store } from '@mini-rx/signal-store';
import { map, timer } from 'rxjs';

@Component({
    selector: 'mini-rx-child',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './child.component.html',
    styleUrls: ['./child.component.scss'],
})
export class ChildComponent {
    cs = createComponentStore({ count: 1 });

    constructor(private store: Store) {
        this.store.dispatch({ type: 'fxStart' });

        const action = this.cs.setState((state) => ({ count: state.count + 1 }), 'inc');
        this.cs.undo(action);

        this.cs.connect({ count: timer(5000).pipe(map(() => 42)) });
    }
}
