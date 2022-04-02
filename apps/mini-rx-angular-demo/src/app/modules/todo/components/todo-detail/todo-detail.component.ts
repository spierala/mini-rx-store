import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Todo } from '../../models/todo';
import { TodosStateService } from '../../state/todos-state.service';

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
        if (this.todo.id) {
            this.todosService.update(this.todo);
        } else {
            this.todosService.create(this.todo);
        }
    }

    delete() {
        this.todosService.delete(this.todo);
    }

    onClose() {
        this.todosService.clearSelectedTodo();
    }
}
