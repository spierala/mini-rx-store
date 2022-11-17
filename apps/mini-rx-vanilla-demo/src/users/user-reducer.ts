import { Action, Reducer } from 'mini-rx-store';
import { UserAction, UserActionType } from './user-actions';
import { initialState, UserState } from './user-state';

export const USER_REDUX_SLICE_KEY: string = 'users-redux';

export const userReducer: Reducer<UserState> = function (
    state: UserState = initialState,
    action: Action
): UserState {
    const userAction = action as UserAction;
    switch (userAction.type) {
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
