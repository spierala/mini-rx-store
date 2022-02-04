import { UserState } from './user.reducer';
import { createFeatureSelector, createSelector } from 'mini-rx-store';


// Selector functions
const getUserFeatureState = createFeatureSelector<UserState>('users');

export const getCurrentUser = createSelector(
  getUserFeatureState,
  state => state.currentUser
);

export const getMaskUserName = createSelector(
  getUserFeatureState,
  state => state.maskUserName
);
