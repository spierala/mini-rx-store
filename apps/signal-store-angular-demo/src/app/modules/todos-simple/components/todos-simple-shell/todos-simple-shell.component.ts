import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { Todo } from '../../../todos-shared/models/todo';
import { cloneDeep } from 'lodash-es';
import { TodoFilter } from '../../../todos-shared/models/todo-filter';
import { TodosSimpleStore } from '../../state/todos-simple-store.service';

@Component({
    templateUrl: './todos-simple-shell.component.html',
    styleUrls: ['./todos-simple-shell.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosSimpleShellComponent {
    todosDone: Signal<Todo[]> = this.todosSimpleStore.todosDone;
    todosNotDone: Signal<Todo[]> = this.todosSimpleStore.todosNotDone;
    selectedTodo: Signal<Todo | undefined> = computed(() => {
        return cloneDeep(this.todosSimpleStore.selectedTodo());
    });
    filter: Signal<TodoFilter> = this.todosSimpleStore.filter;

    constructor(public todosSimpleStore: TodosSimpleStore) {}
}
