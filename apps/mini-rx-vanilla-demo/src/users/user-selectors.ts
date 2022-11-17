import { createFeatureSelector, createSelector } from 'mini-rx-store';
import { UserState } from './user-state';
import { USER_REDUX_SLICE_KEY } from './user-reducer';

export const getUserFeatureState = createFeatureSelector<UserState>(USER_REDUX_SLICE_KEY);

export const getUsers = createSelector(getUserFeatureState, (st) => st.users);

export const getSelectedUserId = createSelector(getUserFeatureState, (st) => st.selectedUserId);

export const getSelectedUser = createSelector(getUsers, getSelectedUserId, (users, id) =>
    users.find((user) => user.id === id)
);
