import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { Todo } from '../../models/todo';

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent implements OnInit {
    @Input()
    todos: Todo[] = [];

    @Input()
    selectedTodo: Todo | undefined;

    @Output()
    selectTodo: EventEmitter<Todo> = new EventEmitter();

    constructor() {}

    ngOnInit(): void {}
}
