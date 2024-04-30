import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../models/todo';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    imports: [FormsModule, CommonModule],
    selector: 'app-todo-detail',
    templateUrl: './todo-detail.component.html',
    styleUrls: ['./todo-detail.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoDetailComponent {
    @Input()
    todo!: Todo;

    @Output()
    create = new EventEmitter<Todo>();

    @Output()
    update = new EventEmitter<Todo>();

    @Output()
    delete = new EventEmitter<Todo>();

    @Output()
    close = new EventEmitter<void>();

    submit() {
        if (this.todo.id) {
            this.update.emit(this.todo);
        } else {
            this.create.emit(this.todo);
        }
    }
}
