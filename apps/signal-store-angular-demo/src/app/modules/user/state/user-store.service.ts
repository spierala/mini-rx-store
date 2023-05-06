import { computed, Injectable, Signal } from '@angular/core';
import { FeatureStore } from '@mini-rx/signal-store';

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

@Injectable({
    providedIn: 'root',
})
export class UserStore extends FeatureStore<UserState> {
    permissions: Signal<Permissions> = computed(() => this.state().permissions);
    userFullName: Signal<string> = computed(() => {
        const user = this.user();
        if (user.firstName === '' && user.lastName === '') {
            return 'John McClane';
        }
        return user.firstName + ' ' + user.lastName;
    });
    user: Signal<User> = computed(() => this.state().user);

    constructor() {
        super('user', initialState);
    }

    toggleCanUpdateProducts() {
        this.update((state) => ({
            permissions: {
                ...state.permissions,
                canUpdateProducts: !state.permissions.canUpdateProducts,
            },
        }));
    }

    updateUser(user: Partial<User>) {
        this.update((state) => ({
            user: {
                ...state.user,
                ...user,
            },
        }));
    }
}
