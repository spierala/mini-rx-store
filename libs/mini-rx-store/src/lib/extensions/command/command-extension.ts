import { Action, AppState, Reducer, StoreExtension } from '../../models';
import StoreCore from '../../store-core';
import { Cmd, NOOP_CMD, RootReducerWithCmds, unwrapCmds, withCmd } from './command-models';

type ProcessCommandsCallback = (commands: Cmd[]) => void;

export class CommandExtension extends StoreExtension {
    init(): void {
        //console.log('CommandExtension initialising');

        const processCommands: ProcessCommandsCallback = (cmds) => {
            this.process(cmds);
        };

        const commandMetaReducer = createCommandMetaReducer(processCommands);

        StoreCore.addMetaReducers(commandMetaReducer);
    }

    async process(commands: Cmd[]) {
        const relevantCmds = commands.filter((cmd) => cmd !== NOOP_CMD);

        console.log(`Received ${commands.length} command(s), ${relevantCmds.length} relevant`);
    }
}

function createCommandMetaReducer(processCommands: ProcessCommandsCallback) {
    function commandMetaReducer(reducer: Reducer<AppState>): Reducer<AppState> {
        //console.log('commandMetaReducer invoked');

        function newReducer(state: AppState, action: Action): AppState {
            const stateWithCmds = withCmd(state);

            const nextStateWithCmds = (reducer as RootReducerWithCmds<AppState, Action>)(
                stateWithCmds,
                action
            );

            const { state: nextState, cmds: commands } = unwrapCmds(nextStateWithCmds);

            processCommands([]);

            return nextState;
        }

        return newReducer;
    }

    return commandMetaReducer;
}
