import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../../../todo-shared/models/todo';
import { map } from 'rxjs/operators';
import { cloneDeep } from 'lodash-es';
import { TodoFilter } from '../../../todo-shared/models/todo-filter';
import { TodosSimpleStateService } from '../../state/todos-simple-state.service';

@Component({
    selector: 'app-todos-simple',
    templateUrl: './todos-simple-shell.component.html',
    styleUrls: ['./todos-simple-shell.component.css'],
})
export class TodosSimpleShellComponent {
    todosDone$: Observable<Todo[]> = this.todosState.todosDone$;
    todosNotDone$: Observable<Todo[]> = this.todosState.todosNotDone$;
    selectedTodo$: Observable<Todo | undefined> = this.todosState.selectedTodo$.pipe(
        map(cloneDeep) // Prevent [(ngModel)] from mutating the state
    );
    filter$: Observable<TodoFilter> = this.todosState.filter$;

    constructor(public todosState: TodosSimpleStateService) {}
}
