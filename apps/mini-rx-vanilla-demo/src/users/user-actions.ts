import { Action } from 'mini-rx-store';
import { User } from './user-models';

export enum UserActionType {
    SelectUser = 'SelectUser',
    AddUser = 'AddUser',
    LoadUsers = 'LoadUsers',
    LoadUsersSuccess = 'LoadUsersSuccess',
    LoadUsersFailure = 'LoadUsersFailure',
    LoadUserById = 'LoadUserById',
    LoadUserByIdSuccess = 'LoadUserByIdSuccess',
    LoadUserByIdFailure = 'LoadUserByIdFailure',
}

export class SelectUserAction implements Action {
    readonly type = UserActionType.SelectUser;

    constructor(public id: number) {}
}

export class AddUserAction implements Action {
    readonly type = UserActionType.AddUser;

    constructor(public user: User) {}
}

export class LoadUsersAction implements Action {
    readonly type = UserActionType.LoadUsers;
}

export class LoadUsersSuccessAction implements Action {
    readonly type = UserActionType.LoadUsersSuccess;

    constructor(public users: User[]) {}
}

export class LoadUsersFailureAction implements Action {
    readonly type = UserActionType.LoadUsersFailure;

    constructor(public error: any) {}
}

export class LoadUserByIdAction implements Action {
    readonly type = UserActionType.LoadUserById;

    constructor(public id: number) {}
}

export class LoadUserByIdSuccessAction implements Action {
    readonly type = UserActionType.LoadUserByIdSuccess;

    constructor(public user: User) {}
}

export class LoadUserByIdFailureAction implements Action {
    readonly type = UserActionType.LoadUserByIdFailure;

    constructor(public error: any) {}
}

export type UserAction =
    | SelectUserAction
    | AddUserAction
    | LoadUsersAction
    | LoadUsersSuccessAction
    | LoadUsersFailureAction
    | LoadUserByIdAction
    | LoadUserByIdSuccessAction
    | LoadUserByIdFailureAction;
