import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../../../todos-shared/models/todo';
import { TodoFilter } from '../../../todos-shared/models/todo-filter';
import { TodosStore } from '../../state/todos-store.service';
import { map } from 'rxjs/operators';
import { cloneDeep } from 'lodash-es';

@Component({
    templateUrl: './todos-shell.component.html',
    styleUrls: ['./todos-shell.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosShellComponent {
    todosDone$: Observable<Todo[]> = this.todosState.todosDone$;
    todosNotDone$: Observable<Todo[]> = this.todosState.todosNotDone$;
    selectedTodo$: Observable<Todo | undefined> = this.todosState.selectedTodo$.pipe(
        map(cloneDeep) // Prevent [(ngModel)] from mutating the state
    );
    filter$: Observable<TodoFilter> = this.todosState.filter$;

    constructor(public todosState: TodosStore) {}
}
