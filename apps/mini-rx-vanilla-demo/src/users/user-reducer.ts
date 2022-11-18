import {
    addCmd,
    withCmd,
    WithCmds,
} from 'libs/mini-rx-store/src/lib/extensions/command/command-models';
import { Action, Reducer } from 'mini-rx-store';
import { UserAction, UserActionType } from './user-actions';
import { loadUsersCmd } from './user-commands';
import { initialState, UserState } from './user-state';

export const USER_REDUX_SLICE_KEY: string = 'users-redux';

const initialStateWithCmds = addCmd(initialState);

export const userReducer: Reducer<UserState & WithCmds> = function (
    state: UserState & WithCmds = initialStateWithCmds,
    action: Action
): UserState & WithCmds {
    const userAction = action as UserAction;
    switch (userAction.type) {
        case UserActionType.LoadUsers:
            return withCmd(state, loadUsersCmd());

        case UserActionType.SelectUser:
            return {
                ...state,
                selectedUserId: userAction.id,
            };

        case UserActionType.AddUser:
            return {
                ...state,
                users: [...state.users, userAction.user],
            };

        case UserActionType.LoadUsersSuccess:
            return {
                ...state,
                users: userAction.users,
            };

        case UserActionType.LoadUserByIdSuccess:
            return {
                ...state,
                users: [...state.users, userAction.user],
            };

        default:
            return state;
    }
};
