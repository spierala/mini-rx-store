import { Action, Reducer, ReducerDictionary } from '../../models';
import {
    addManyCmds,
    cleanCmds,
    Cmd,
    isWithCmds,
    SliceReducerWithCmds,
    withCmd,
} from './command-models';

export function commandCombineReducers<T extends object = {}>(
    reducers: ReducerDictionary<T>
): Reducer<T> {
    //console.log('commandCombineReducers invoked');

    const reducerKeys: Array<keyof T> = Object.keys(reducers) as Array<keyof T>;
    const reducerKeyLength: number = reducerKeys.length;

    let commands = [] as Cmd[];

    return (state: T, action: Action) => {
        const stateKeysLength: number = Object.keys(state).length;

        let hasChanged: boolean = stateKeysLength !== reducerKeyLength;
        const nextState: T = {} as T;

        for (let i = 0; i < reducerKeyLength; i++) {
            const key = reducerKeys[i];
            const reducer = reducers[key];
            const previousStateForKey = state[key];
            let nextStateForKey: T[keyof T];

            // when a feature slice reducer returns commands, both input and
            // output state have commands: use this info to detect those reducers

            if (isWithCmds(previousStateForKey)) {
                // command-based reducer

                const previousStateForKeyWithEmptyCmds = withCmd(previousStateForKey);
                const cmdReducer = reducer as unknown as SliceReducerWithCmds<T[keyof T]>;

                const nextStateForKeyWithCmds = cmdReducer(
                    previousStateForKeyWithEmptyCmds,
                    action
                );

                const { cleaned: nextStateForKeyWithEmptyCmds, cmds: commandsForKey } =
                    cleanCmds(nextStateForKeyWithCmds);

                nextStateForKey = nextStateForKeyWithEmptyCmds;
                commands = commands.concat(...commandsForKey);
            } else {
                // regular reducer

                nextStateForKey = reducer(previousStateForKey, action);
            }

            nextState[key] = nextStateForKey;
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        }
        return hasChanged ? addManyCmds(nextState, commands) : addManyCmds(state, commands);
    };
}
