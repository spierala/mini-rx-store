import { User } from './user-models';

export interface UserState {
    users: User[];
    selectedUserId: number | undefined;
    isLoading: boolean;
}

export const initialState: UserState = {
    users: [],
    selectedUserId: undefined,
    isLoading: false,
};
