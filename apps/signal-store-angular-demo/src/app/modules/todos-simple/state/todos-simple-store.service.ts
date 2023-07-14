import { Injectable, Signal } from '@angular/core';
import { Todo } from '../../todos-shared/models/todo';
import { TodoFilter } from '../../todos-shared/models/todo-filter';
import { TodosApiService } from '../../todos-shared/services/todos-api.service';
import { FeatureStore } from '@mini-rx/signal-store';

// STATE INTERFACE
interface TodosState {
    todos: Todo[];
    filter: TodoFilter;
    selectedTodo: Todo | undefined;
}

// INITIAL STATE
const initialState: TodosState = {
    todos: [],
    selectedTodo: undefined,
    filter: {
        search: '',
        category: {
            isBusiness: false,
            isPrivate: false,
        },
    },
};

@Injectable({
    providedIn: 'root',
})
export class TodosSimpleStore extends FeatureStore<TodosState> {
    // STATE SIGNALS
    todosDone: Signal<Todo[]> = this.select((state) => {
        const filteredTodos = filterTodos(state.todos, state.filter);
        return filteredTodos.filter((todo) => todo.isDone);
    });
    todosNotDone: Signal<Todo[]> = this.select((state) => {
        const filteredTodos = filterTodos(state.todos, state.filter);
        return filteredTodos.filter((todo) => !todo.isDone);
    });
    filter: Signal<TodoFilter> = this.select((state) => state.filter);
    selectedTodo: Signal<Todo | undefined> = this.select((state) => state.selectedTodo);

    constructor(private apiService: TodosApiService) {
        super('todos-simple', initialState);

        this.load();
    }

    // UPDATE STATE
    selectTodo(todo: Todo) {
        this.update({ selectedTodo: todo });
    }

    initNewTodo() {
        const newTodo = new Todo();
        this.update({ selectedTodo: newTodo });
    }

    clearSelectedTodo() {
        this.update({
            selectedTodo: undefined,
        });
    }

    updateFilter(filter: TodoFilter) {
        this.update((state) => ({
            filter: {
                ...state.filter,
                ...filter,
            },
        }));
    }

    // API CALLS
    load(): void {
        this.apiService.getTodos().subscribe((todos) => this.update({ todos }));
    }

    create(todo: Todo): void {
        this.apiService.createTodo(todo).subscribe((createdTodo) =>
            this.update((state) => ({
                todos: [...state.todos, createdTodo],
                selectedTodo: createdTodo,
            }))
        );
    }

    updateTodo(todo: Todo): void {
        this.apiService.updateTodo(todo).subscribe((updatedTodo) =>
            this.update((state) => ({
                todos: updateTodoInList(state.todos, updatedTodo),
            }))
        );
    }

    delete(todo: Todo): void {
        this.apiService.deleteTodo(todo).subscribe(() =>
            this.update((state) => ({
                selectedTodo: undefined,
                todos: state.todos.filter((item) => item.id !== todo.id),
            }))
        );
    }
}

function updateTodoInList(todos: Todo[], updatedTodo: Todo): Todo[] {
    return todos.map((item) =>
        item.id === updatedTodo.id
            ? {
                  ...item,
                  ...updatedTodo,
              }
            : item
    );
}

function filterTodos(todos: Todo[], filter: TodoFilter) {
    return todos.filter((item) => {
        return (
            item.title.toUpperCase().indexOf(filter.search.toUpperCase()) > -1 &&
            (filter.category.isBusiness ? item.isBusiness : true) &&
            (filter.category.isPrivate ? item.isPrivate : true)
        );
    });
}
