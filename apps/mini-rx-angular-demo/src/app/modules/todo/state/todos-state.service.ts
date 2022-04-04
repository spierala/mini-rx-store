import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import { Filter } from '../models/filter';
import { EMPTY, Observable } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { TodosApiService } from '../services/todos-api.service';
import { v4 as uuid } from 'uuid';
import { Action, createFeatureSelector, createSelector, FeatureStore } from 'mini-rx-store';

// STATE INTERFACE
interface TodoState {
    todos: Todo[];
    filter: Filter;
    selectedTodo: Todo | undefined;
}

// INITIAL STATE
const initialState: TodoState = {
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

// MEMOIZED SELECTORS
const getTodosFeatureSelector = createFeatureSelector<TodoState>();
const getTodos = createSelector(getTodosFeatureSelector, (state) => state.todos);
const getSelectedTodo = createSelector(getTodosFeatureSelector, (state) => state.selectedTodo);
const getFilter = createSelector(getTodosFeatureSelector, (state) => state.filter);
const getTodosFiltered = createSelector(getTodos, getFilter, (todos, filter) => {
    return todos.filter((item) => {
        return (
            item.title.toUpperCase().indexOf(filter.search.toUpperCase()) > -1 &&
            (filter.category.isBusiness ? item.isBusiness : true) &&
            (filter.category.isPrivate ? item.isPrivate : true)
        );
    });
});
const getTodosDone = createSelector(getTodosFiltered, (todos) =>
    todos.filter((todo) => todo.isDone)
);
const getTodosNotDone = createSelector(getTodosFiltered, (todos) =>
    todos.filter((todo) => !todo.isDone)
);

@Injectable({
    providedIn: 'root',
})
export class TodosStateService extends FeatureStore<TodoState> {
    // STATE OBSERVABLES
    todosDone$: Observable<Todo[]> = this.select(getTodosDone);
    todosNotDone$: Observable<Todo[]> = this.select(getTodosNotDone);
    filter$: Observable<Filter> = this.select(getFilter);
    selectedTodo$: Observable<Todo | undefined> = this.select(getSelectedTodo);

    constructor(private apiService: TodosApiService) {
        super('todos', initialState);

        this.load();
    }

    // UPDATE STATE
    selectTodo(todo: Todo) {
        this.setState({ selectedTodo: todo }, 'selectTodo');
    }

    initNewTodo() {
        const newTodo = new Todo();
        newTodo.tempId = uuid();
        this.setState({ selectedTodo: newTodo }, 'initNewTodo');
    }

    clearSelectedTodo() {
        this.setState(
            {
                selectedTodo: undefined,
            },
            'clearSelectedTodo'
        );
    }

    updateFilter(filter: Filter) {
        this.setState(
            (state) => ({
                filter: {
                    ...state.filter,
                    ...filter,
                },
            }),
            'updateFilter'
        );
    }

    // API CALLS...
    // ...with effect
    load = this.effect((payload$) => {
        return payload$.pipe(
            mergeMap(() =>
                this.apiService.getTodos().pipe(
                    tap((todos) => this.setState({ todos }, 'loadSuccess')),
                    catchError((err) => {
                        console.error(err);
                        return EMPTY;
                    })
                )
            )
        );
    });

    // ... with effect (and optimistic update / undo)
    create = this.effect<Todo>(
        // FYI: we can skip the payload$.pipe when using just one RxJS operator
        mergeMap((todo) => {
            const optimisticUpdate: Action = this.setState(
                (state) => ({
                    todos: [...state.todos, todo],
                    selectedTodo: todo,
                }),
                'createOptimistic'
            );

            return this.apiService.createTodo(todo).pipe(
                tap((createdTodo) => {
                    this.setState(
                        (state) => ({
                            todos: state.todos.map((item) =>
                                item.tempId === todo.tempId ? createdTodo : item
                            ),
                            selectedTodo: createdTodo,
                        }),
                        'createSuccess'
                    );
                }),
                catchError((err) => {
                    console.error(err);
                    this.undo(optimisticUpdate);
                    return EMPTY;
                })
            );
        })
    );

    // ...with subscribe (and optimistic update / undo)
    update(todo: Todo) {
        const optimisticUpdate: Action = this.setState(
            (state) => ({
                todos: updateTodoInList(state.todos, todo),
            }),
            'updateOptimistic'
        );

        this.apiService
            .updateTodo(todo)
            .pipe(
                tap((updatedTodo) => {
                    this.setState(
                        (state) => ({
                            todos: updateTodoInList(state.todos, updatedTodo),
                        }),
                        'updateSuccess'
                    );
                }),
                catchError((err) => {
                    console.error(err);
                    this.undo(optimisticUpdate);
                    return EMPTY;
                })
            )
            .subscribe();
    }

    // ...with subscribe (and optimistic update / undo)
    delete(todo: Todo) {
        const optimisticUpdate: Action = this.setState(
            (state) => ({
                selectedTodo: undefined,
                todos: state.todos.filter((item) => item.id !== todo.id),
            }),
            'deleteOptimistic'
        );

        this.apiService
            .deleteTodo(todo)
            .pipe(
                catchError((err) => {
                    console.error(err);
                    this.undo(optimisticUpdate);
                    return EMPTY;
                })
            )
            .subscribe();
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
