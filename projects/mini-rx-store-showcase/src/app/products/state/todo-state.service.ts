import { Injectable } from '@angular/core';
import { Feature } from 'mini-rx-store';
import { Observable } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export class Todo {
    id: number;
    title: string;
}

interface TodoState {
    title: string;
    todos: Todo[];
    selectedTodoId: number;
}

const initialState: TodoState = {
    title: 'Hello MiniRx',
    todos: [],
    selectedTodoId: undefined
};

@Injectable({providedIn: 'root'})
export class TodosService extends Feature<TodoState> {
    title$: Observable<string> = this.select(state => state.title);
    todos$: Observable<Todo[]> = this.select(state => state.todos) as Observable<Todo[]>; // TODO fix
    selectedTodo$: Observable<Todo> = this.select(state => {
        if (!state.selectedTodoId) {
            return new Todo();
        }
        return (state.todos as Todo[]).find(
            // TODO fix
            item => item.id === state.selectedTodoId
        );
    });

    constructor(private http: HttpClient) {
        super('todos', initialState);

        this.load();
    }

    addTodo(todo: Todo) {
        this.setState({
                todos: [todo, ...this.state.todos]
            }
        );
    }

    selectTodo(todo: Todo) {
        this.setState({selectedTodoId: todo.id});
    }

    removeAllTodos() {
        this.setState({todos: []});
    }

    load = this.createEffect(payload$ =>
        payload$.pipe(
            switchMap(() =>
                this.http
                    .get<Todo[]>('https://jsonplaceholder.typicode.com/todos')
                    .pipe(map(todos => ({todos})))
            )
        )
    );

    create = this.createEffect<Todo>(payload$ =>
        payload$.pipe(
            switchMap(todo =>
                this.http
                    .post<Todo>('https://jsonplaceholder.typicode.com/todos', todo)
                    .pipe(map(newTodo => ({todos: [...this.state.todos, newTodo]})))
            )
        )
    );

    update = this.createEffect<Todo>(payload$ =>
        payload$.pipe(
            switchMap(todo =>
                this.http
                    .put<Todo>(
                        'https://jsonplaceholder.typicode.com/todos/' + todo.id,
                        todo
                    )
                    .pipe(
                        map(newTodo => ({
                            todos: this.state.todos.map(item => item.id === newTodo.id ? todo : item
                            )
                        }))
                    )
            )
        )
    );

    delete = this.createEffect<Todo>(
        payload$ =>
            payload$.pipe(
                switchMap(todo =>
                    this.http
                        .delete<Todo>(
                            'https://jsonplaceholder.typicode.com/todos/' + todo.id
                        )
                        .pipe(
                            mapTo({
                                selectedTodoId: undefined,
                                todos: this.state.todos.filter(item => item.id !== todo.id)
                            })
                        )
                )
            )
    );
}
