import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo';
import { Filter } from '../../models/filter';
import { TodosStateService } from '../../state/todos-state.service';
import { map } from 'rxjs/operators';
import { cloneDeep } from 'lodash-es';

@Component({
    selector: 'app-todo-shell',
    templateUrl: './todo-shell.component.html',
    styleUrls: ['./todo-shell.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoShellComponent {
    todosDone$: Observable<Todo[]> = this.todosState.todosDone$;
    todosNotDone$: Observable<Todo[]> = this.todosState.todosNotDone$;
    selectedTodo$: Observable<Todo | undefined> = this.todosState.selectedTodo$.pipe(
        map(cloneDeep) // Prevent [(ngModel)] from mutating the state
    );
    filter$: Observable<Filter> = this.todosState.filter$;

    constructor(private todosState: TodosStateService) {}

    selectTodo(todo: Todo) {
        this.todosState.selectTodo(todo);
    }

    addTodo() {
        this.todosState.initNewTodo();
    }

    onFilterUpdate(filter: Filter) {
        this.todosState.updateFilter(filter);
    }
}
