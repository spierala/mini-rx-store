import { Action, Reducer, ReducerDictionary } from '../../models';
import { cleanCmds, Cmd, isWithCmds, withCmd, withManyCmds } from './command-models';

export function commandCombineReducers<T>(reducers: ReducerDictionary<T>): Reducer<T>;
export function commandCombineReducers(reducers: ReducerDictionary<any>): Reducer<any> {
    //console.log('commandCombineReducers invoked');

    const reducerKeys: string[] = Object.keys(reducers);
    const reducerKeyLength: number = reducerKeys.length;

    let commands = [] as Cmd[];

    return (state: any = {}, action: Action) => {
        const stateKeysLength: number = Object.keys(state).length;

        let hasChanged: boolean = stateKeysLength !== reducerKeyLength;
        const nextState: any = {};

        for (let i = 0; i < reducerKeyLength; i++) {
            const key = reducerKeys[i];
            const reducer: any = reducers[key];
            const previousStateForKey = state[key];
            const nextResultForKey = reducer(previousStateForKey, action);

            let nextStateForKey: any;
            if (isWithCmds(nextResultForKey)) {
                const { cleaned: stateForKeyWithoutCmds, cmds: commandsForKey } =
                    cleanCmds(nextResultForKey);

                nextStateForKey = stateForKeyWithoutCmds;

                commands = commands.concat(...commandsForKey);
            } else {
                nextStateForKey = nextResultForKey;
            }

            nextState[key] = nextStateForKey;
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        }
        return hasChanged ? withManyCmds(nextState, commands) : withCmd(state);
    };
}
