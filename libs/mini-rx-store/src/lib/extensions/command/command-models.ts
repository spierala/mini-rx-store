// types inspired from redux-toolkit createAction

import { Action } from '../../models';

// types of commands

export type CmdWithoutPayload<T extends string = string> = {
    type: T;
};

export type CmdWithPayload<T extends string = string, P = any> = CmdWithoutPayload<T> & {
    payload: P;
};

export type Cmd<T extends string = string, P = any> = CmdWithPayload<T, P> | CmdWithoutPayload<T>;

// types of command creators

export interface CmdCreatorWithoutPayload<T extends string = string> {
    type: T;
    match: (cmd: Cmd) => cmd is CmdWithoutPayload<T>;
    (): CmdWithoutPayload<T>;
}

export interface CmdCreatorWithPayload<T extends string = string, P = any> {
    type: T;
    match: (cmd: Cmd) => cmd is CmdWithPayload<T, P>;
    (arg: P): CmdWithPayload<T, P>;
}

// command configurators

export function configureCmd<T extends string = string>(type: T): CmdCreatorWithoutPayload<T> {
    function cmdCreator(): CmdWithoutPayload<T> {
        return {
            type,
        };
    }

    cmdCreator.toString = () => `${type}`;

    cmdCreator.type = type;

    cmdCreator.match = function (cmd: Cmd): cmd is CmdWithoutPayload<T> {
        return cmd.type === type;
    };

    return cmdCreator;
}

export function configureCmdWithPayload<T extends string = string, P = any>(
    type: T
): CmdCreatorWithPayload<T, P> {
    function cmdCreator(arg: P): CmdWithPayload<T, P> {
        return {
            type,
            payload: arg,
        };
    }

    cmdCreator.toString = () => `${type}`;

    cmdCreator.type = type;

    cmdCreator.match = function (cmd: Cmd): cmd is CmdWithPayload<T, P> {
        return cmd.type === type;
    };

    return cmdCreator;
}

export const NOOP_CMD: CmdWithoutPayload<'@@commands/noop'> = {
    type: '@@commands/noop',
};

// types and utilities to enrich state with commands

const cmdsSym = Symbol('cmds');

export interface WithCmds {
    [cmdsSym]: Cmd[];
}

export function isWithCmds<T = any>(arg: T): arg is T & WithCmds {
    return typeof arg === 'object' && arg !== null && cmdsSym in arg;
}

export function withCmd<S>(state: S, command?: Cmd): S & WithCmds {
    const commands = command ? [command] : [];

    return {
        ...state,
        [cmdsSym]: commands,
    };
}

export function withManyCmds<S>(state: S, commands: Cmd[] = []): S & WithCmds {
    return {
        ...state,
        [cmdsSym]: commands,
    };
}

export function withSomeCmd<S>(state: S, oneOrMoreCommands: Cmd | Cmd[] = []): S & WithCmds {
    return Array.isArray(oneOrMoreCommands)
        ? withManyCmds(state, oneOrMoreCommands)
        : withCmd(state, oneOrMoreCommands);
}

export function setCmd<S>(state: S & WithCmds, command: Cmd): void {
    state[cmdsSym] = [command];
}

export function setManyCmds<S>(state: S & WithCmds, commands: Cmd[]): void {
    state[cmdsSym] = commands;
}

export function getCmds<S>({ [cmdsSym]: cmds }: S & WithCmds): Cmd[] {
    return cmds;
}

export function removeCmds<S>({ [cmdsSym]: cmds, ...state }: S & WithCmds): S {
    return {
        ...state,
    } as unknown as S;
}

export interface UnwrappedCmds<S> {
    state: S;
    cmds: Cmd[];
}

export function unwrapCmds<S>({ [cmdsSym]: cmds, ...state }: S & WithCmds): UnwrappedCmds<S> {
    return {
        state: state as unknown as S,
        cmds,
    };
}

export interface CleanedCmds<S> {
    cleaned: S & WithCmds;
    cmds: Cmd[];
}

export function cleanCmds<S>({ [cmdsSym]: cmds, ...state }: S & WithCmds): CleanedCmds<S> {
    return {
        cleaned: withCmd(state as unknown as S),
        cmds,
    };
}

// types of reducers handling commands

export type RootReducerWithCmds<S, A extends Action = Action> = (
    state: S,
    action: A
) => S & WithCmds;

export type SliceReducerWithCmds<S, A extends Action = Action> = (
    state: S & WithCmds,
    action: A
) => S & WithCmds;
