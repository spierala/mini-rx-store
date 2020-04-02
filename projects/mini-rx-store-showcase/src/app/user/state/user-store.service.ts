import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../user';
import { createFeatureSelector, createSelector, Feature, Store } from 'mini-rx-store';

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
export class UserStoreService {

    // Create Feature Store
    private feature: Feature<UserState> = Store.feature<UserState>('users', initialState);

    maskUserName$: Observable<boolean> = this.feature.select(getMaskUser);

    updateMaskUserName(maskUserName: boolean) {
        // Update State
        this.feature.setState({maskUserName});
    }
}

// Demonstrate how to use memoized selectors with a Feature Store
const getUserFeatureState = createFeatureSelector<UserState>(); // Omit the feature name
const getMaskUser = createSelector(getUserFeatureState, (state => state.maskUserName));
