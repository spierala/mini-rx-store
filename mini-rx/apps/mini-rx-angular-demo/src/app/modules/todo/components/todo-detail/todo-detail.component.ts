import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Todo } from '../../models/todo';
import { TodosStateService } from '../../state/todos-state.service';
import { cloneDeep } from 'lodash-es';

@Component({
    selector: 'app-todo-detail',
    templateUrl: './todo-detail.component.html',
    styleUrls: ['./todo-detail.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoDetailComponent implements OnInit {
    @Input()
    todo!: Todo;

    constructor(private todosService: TodosStateService) {}

    ngOnInit() {}

    submit() {
        const clonedTodo = cloneDeep(this.todo);
        // Clone again, otherwise the ImmutableExtension might freeze `this.todo`...
        // ...and further [(ngModel)] changes would throw an exception
        if (this.todo.id) {
            this.todosService.update(clonedTodo);
        } else {
            this.todosService.create(clonedTodo);
        }
    }

    delete() {
        this.todosService.delete(this.todo);
    }

    onClose() {
        this.todosService.clearSelectedTodo();
    }
}
