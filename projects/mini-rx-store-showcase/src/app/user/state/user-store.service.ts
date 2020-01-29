import { Injectable } from '@angular/core';
import { MiniStore } from 'mini-rx-store';
import { reducer } from './user.reducer';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  constructor() {
    MiniStore.addFeature('users', reducer);
  }
}
