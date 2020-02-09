import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../user';
import { MiniFeature, MiniStore } from 'mini-rx-store';

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

    maskUserName$: Observable<boolean> = this.feature.state$.pipe(map(state => state.maskUserName));

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
