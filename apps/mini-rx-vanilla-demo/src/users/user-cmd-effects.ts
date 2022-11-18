import { ofType } from 'libs/mini-rx-store/src/lib/extensions/command/command-models';
import { CommandExtension, mapResponse } from 'mini-rx-store';
import { catchError, mergeMap, map, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
    LoadUserByIdFailureAction,
    LoadUserByIdSuccessAction,
    LoadUsersFailureAction,
    LoadUsersSuccessAction,
} from './user-actions';
import { UserCmdType } from './user-commands';
import { User } from './user-models';

function httpUserToUser({ id, username, name, email }: User): User {
    return { id, username, name, email };
}

// @command: things could be rearranged so that commandExtension.command$ is available
// as a singleton in the same way as StoreCore.action$. Not sure how much important
// is to keep that aspect the same as regular, action-based effects

export function registerUserCmdEffects(commandExtension: CommandExtension) {
    const loadUserCmdsEffect = commandExtension.command$.pipe(
        ofType(UserCmdType.LoadUsers),
        mergeMap(() =>
            ajax<User[]>('https://jsonplaceholder.typicode.com/users').pipe(
                map((res) => res.response.map(httpUserToUser)),
                map((users) => new LoadUsersSuccessAction(users)),
                catchError((err) => of(new LoadUsersFailureAction(err)))
            )
        )
    );

    const loadUserByIdCmdEffect = commandExtension.command$.pipe(
        ofType(UserCmdType.LoadUserById),
        mergeMap((id) =>
            ajax<User>(`https://jsonplaceholder.typicode.com/users?id=${id}`).pipe(
                mapResponse(
                    (res) => new LoadUserByIdSuccessAction(httpUserToUser(res.response)),
                    (err) => new LoadUserByIdFailureAction(err)
                )
            )
        )
    );

    /* @command: TODO
    commandExtension.effect(loadUserCmdsEffect);
    commandExtension.effect(loadUserByIdCmdEffect);
    */
}
