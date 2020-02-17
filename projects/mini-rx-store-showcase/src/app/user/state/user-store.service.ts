import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../user';
import { createFeatureSelector, createSelector, MiniFeature, MiniStore } from 'mini-rx-store';

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
    private feature: MiniFeature<UserState> = MiniStore.feature<UserState>('users', initialState);

    // maskUserName$: Observable<boolean> = this.feature.select(state => state.maskUserName);
    maskUserName$: Observable<boolean> = this.feature.select(getMaskUser);

    updateMaskUserName(maskUserName: boolean) {
        // Update State
        this.feature.setState((state) => {
            return {
                ...state,
                maskUserName
            }
        });
    }
}

const getUserFeatureState = createFeatureSelector();
const getMaskUser = createSelector(state => state, (state => state.maskUserName));
