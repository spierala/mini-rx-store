import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../user';
import { createFeatureSelector, createSelector, Feature } from 'mini-rx-store';

export interface UserState {
    maskUserName: boolean;
    currentUser: User;
}

const initialState: UserState = {
    maskUserName: true,
    currentUser: null
};

@Injectable({
    providedIn: 'root'
})
export class UserStoreService extends Feature<UserState> {

    constructor() {
        super('users', initialState);
    }

    maskUserName$: Observable<boolean> = this.select(getMaskUser);

    updateMaskUserName(maskUserName: boolean) {
        // Update State
        this.setState({maskUserName});
    }
}

// Demonstrate how to use memoized selectors with a Feature Store
const getUserFeatureState = createFeatureSelector<UserState>(); // Omit the feature name
const getMaskUser = createSelector(getUserFeatureState, (state => state.maskUserName));
