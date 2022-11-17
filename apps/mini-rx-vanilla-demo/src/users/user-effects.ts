import { actions$, mapResponse, ofType, Store } from 'mini-rx-store';
import { catchError, mergeMap, map, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { User } from './user-models';
import {
    LoadUserByIdFailureAction,
    LoadUserByIdSuccessAction,
    LoadUsersFailureAction,
    LoadUsersSuccessAction,
    UserActionType,
} from './user-actions';

function httpUserToUser({ id, username, name, email }: User): User {
    return { id, username, name, email };
}

const loadUsersEffect = actions$.pipe(
    ofType(UserActionType.LoadUsers),
    mergeMap(() =>
        ajax<User[]>('https://jsonplaceholder.typicode.com/users').pipe(
            map((res) => res.response.map(httpUserToUser)),
            map((users) => new LoadUsersSuccessAction(users)),
            catchError((err) => of(new LoadUsersFailureAction(err)))
        )
    )
);

const loadUserByIdEffect = actions$.pipe(
    ofType(UserActionType.LoadUserById),
    mergeMap((id) =>
        ajax<User>(`https://jsonplaceholder.typicode.com/users?id=${id}`).pipe(
            mapResponse(
                (res) => new LoadUserByIdSuccessAction(httpUserToUser(res.response)),
                (err) => new LoadUserByIdFailureAction(err)
            )
        )
    )
);

export function registerUserEffects(store: Store) {
    store.effect(loadUsersEffect);
    store.effect(loadUserByIdEffect);
}
