// types inspired from redux-toolkit createAction

import { Observable, OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Action } from '../../models';

// types of commands

const cmdSym = Symbol('cmd');

export type CmdWithoutPayload<T extends string = string> = {
    type: T;
    // @command: action and command both have a 'type' property,
    // add a symbol to distinguish commands from actions in CommandProcessor.
    // The _actual_ need is an 'isAction' function (better if a TypeScript user-defined type guard)
    // to detect whether a command-based effect returns an action, as opposed to anything else.
    // Ideally, a symbol property should go in Action type
    [cmdSym]: 'command';
};

export type CmdWithPayload<T extends string = string, P = any> = CmdWithoutPayload<T> & {
    payload: P;
};

export type Cmd<T extends string = string, P = any> = CmdWithPayload<T, P> | CmdWithoutPayload<T>;

export function isCmd(arg: any): arg is Cmd {
    return typeof arg === 'object' && arg !== null && cmdSym in arg;
}

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
// @command: configurators and creators are not essential to the overall feature:
// they're just helpers in the same vein as Redux-Toolkit action creators, but could
// be swapped for something else, or nothing at all

export function configureCmd<T extends string = string>(type: T): CmdCreatorWithoutPayload<T> {
    function cmdCreator(): CmdWithoutPayload<T> {
        return {
            type,
            [cmdSym]: 'command',
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
            [cmdSym]: 'command',
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
    [cmdSym]: 'command',
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

export function setCmd<S>(state: S & WithCmds, command: Cmd): void {
    state[cmdsSym] = [command];
}

export function setManyCmds<S>(state: S & WithCmds, commands: Cmd[]): void {
    state[cmdsSym] = commands;
}

export function getCmds<S>({ [cmdsSym]: cmds }: S & WithCmds): Cmd[] {
    return cmds;
}

export function withoutCmds<S>({ [cmdsSym]: cmds, ...state }: S & WithCmds): S {
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

export function cleanCmds<S>(stateWithCmds: S & WithCmds): CleanedCmds<S> {
    const { [cmdsSym]: cmds, ...state } = stateWithCmds;

    const stateWithEmptyCmds = cmds.length > 0 ? withCmd(state as unknown as S) : stateWithCmds;

    return {
        cleaned: stateWithEmptyCmds,
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

// types and utilities to observe commands

export type Cmd$ = Observable<Cmd>;

export type CmdEffectOutput = Action | Cmd | void;

export type CmdEffect = Observable<CmdEffectOutput>;

export function ofType(...allowedTypes: string[]): OperatorFunction<Cmd, Cmd> {
    return filter((cmd: Cmd) =>
        allowedTypes.some((type) => {
            return type === cmd.type;
        })
    );
}
