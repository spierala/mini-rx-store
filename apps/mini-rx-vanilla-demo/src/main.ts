import { appStore } from './app-store/app-store';
import './app/app.element.ts';
import { LoadUsersAction } from './users/user-actions';
import { getUsers } from './users/user-selectors';

function useAppStore() {
    const users$ = appStore.select(getUsers);
    users$.subscribe((users) => {
        console.log(users);
    });

    // run in next JS task, to simulate an event firing and its callback being run
    setTimeout(() => {
        appStore.dispatch(new LoadUsersAction());
    }, 0);

    setTimeout(() => {
        appStore.dispatch(new LoadUsersAction());
    }, 1000);
}

useAppStore();
