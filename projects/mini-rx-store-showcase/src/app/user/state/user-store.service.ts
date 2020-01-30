import { Injectable } from '@angular/core';
import { FeatureStore, MiniStore } from 'mini-rx-store';
import { UserState } from './user.reducer';

@Injectable({
    providedIn: 'root'
})
export class UserStoreService {

    private feature: FeatureStore<UserState> = MiniStore.addFeature('users');

    constructor() {
        setTimeout(() => {
            this.test();
        }, 5000);

        this.feature.state$.subscribe(state => console.log('test', state));
    }

    test() {
        this.feature.setState({
            maskUserName: true,
            currentUser: {
                id: 12,
                userName: 'Flo',
                isAdmin: true
            }
        });
    }
}
