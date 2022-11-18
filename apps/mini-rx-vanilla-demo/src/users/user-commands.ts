import {
    configureCmd,
    configureCmdWithPayload,
} from 'libs/mini-rx-store/src/lib/extensions/command/command-models';

export enum UserCmdType {
    LoadUsers = 'LoadUsers',
    LoadUserById = 'LoadUserById',
}

export const loadUsersCmd = configureCmd(UserCmdType.LoadUsers);

export const loadUserByIdCmd = configureCmdWithPayload<string, number>(UserCmdType.LoadUserById);
