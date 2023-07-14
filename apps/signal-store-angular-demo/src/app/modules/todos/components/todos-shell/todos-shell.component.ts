import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { Todo } from '../../../todos-shared/models/todo';
import { TodoFilter } from '../../../todos-shared/models/todo-filter';
import { TodosStore } from '../../state/todos-store.service';
import { cloneDeep } from 'lodash-es';

@Component({
    templateUrl: './todos-shell.component.html',
    styleUrls: ['./todos-shell.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosShellComponent {
    todosDone: Signal<Todo[]> = this.todosState.todosDone;
    todosNotDone: Signal<Todo[]> = this.todosState.todosNotDone;
    selectedTodo: Signal<Todo | undefined> = computed(
        () => cloneDeep(this.todosState.selectedTodo()) // Prevent [(ngModel)] from mutating the state
    );
    filter: Signal<TodoFilter> = this.todosState.filter;

    constructor(public todosState: TodosStore) {}
}
