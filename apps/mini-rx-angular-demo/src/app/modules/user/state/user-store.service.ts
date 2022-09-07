import { Injectable } from '@angular/core';
import { createFeatureSelector, createSelector, FeatureStore } from 'mini-rx-store';
import { Observable } from 'rxjs';

export const featureKeyUser = 'user';

export interface UserState {
    user: User;
    permissions: Permissions;
}

export interface Permissions {
    canUpdateProducts: boolean;
}

interface User {
    firstName: string;
    lastName: string;
}

const initialState: UserState = {
    user: {
        firstName: 'John',
        lastName: 'Doe',
    },
    permissions: {
        canUpdateProducts: false,
    },
};

const getUserFeatureState = createFeatureSelector<UserState>();
const getUser = createSelector(getUserFeatureState, (state) => state.user);
const getUserFullName = createSelector(getUser, (user) => {
    if (user.firstName === '' && user.lastName === '') {
        return 'John McClane';
    }
    return user.firstName + ' ' + user.lastName;
});
const getPermissions = createSelector(getUserFeatureState, (state) => state.permissions);

@Injectable({
    providedIn: 'root',
})
export class UserStore extends FeatureStore<UserState> {
    permissions$: Observable<Permissions> = this.select(getPermissions);
    userFullName$: Observable<string> = this.select(getUserFullName);
    user$: Observable<User> = this.select(getUser);

    constructor() {
        super('user', initialState);
    }

    toggleCanUpdateProducts() {
        this.setState((state) => ({
            permissions: {
                ...state.permissions,
                canUpdateProducts: !state.permissions.canUpdateProducts,
            },
        }));
    }

    updateUser(user: Partial<User>) {
        this.setState((state) => ({
            user: {
                ...state.user,
                ...user,
            },
        }));
    }
}
