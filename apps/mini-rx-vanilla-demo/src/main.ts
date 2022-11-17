import { appStore } from './app-store/app-store';
import './app/app.element.ts';
import { LoadUsersAction } from './users/user-actions';
import { getUsers } from './users/user-selectors';

function useAppStore() {
    const users$ = appStore.select(getUsers);
    users$.subscribe((users) => {
        console.log(users);
    });

    appStore.dispatch(new LoadUsersAction());
}

useAppStore();
