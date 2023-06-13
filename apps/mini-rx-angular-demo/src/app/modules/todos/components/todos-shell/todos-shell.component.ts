import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TodosStore} from '../../state/todos-store.service';

@Component({
    templateUrl: './todos-shell.component.html',
    styleUrls: ['./todos-shell.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosShellComponent {
    vm$ = this.todosState.vm$;

    constructor(public todosState: TodosStore) {}
}
