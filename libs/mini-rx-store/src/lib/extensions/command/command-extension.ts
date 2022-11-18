import { Action, AppState, Reducer, StoreExtension } from '../../models';
import StoreCore from '../../store-core';
import { addCmd, Cmd, Cmd$, CmdEffect, RootReducerWithCmds, unwrapCmds } from './command-models';
import { CommandProcessor } from './command-processor';

type ProcessCommandsCallback = (commands: Cmd[]) => void;

export class CommandExtension extends StoreExtension {
    private readonly commandProcessor: CommandProcessor;

    public get command$(): Cmd$ {
        return this.commandProcessor.commands$;
    }

    constructor() {
        super();
        this.commandProcessor = new CommandProcessor();
    }

    init(): void {
        //console.log('CommandExtension initialising');

        const processCommands: ProcessCommandsCallback = (cmds) => {
            this.commandProcessor.process(cmds);
        };

        const commandMetaReducer = createCommandMetaReducer(processCommands);

        StoreCore.addMetaReducers(commandMetaReducer);
    }

    effect(effect$: CmdEffect): void {
        this.commandProcessor.addEffect(effect$);
    }
}

function createCommandMetaReducer(processCommands: ProcessCommandsCallback) {
    function commandMetaReducer(reducer: Reducer<AppState>): Reducer<AppState> {
        //console.log('commandMetaReducer invoked');

        function newReducer(state: AppState, action: Action): AppState {
            const stateWithCmds = addCmd(state);

            const nextStateWithCmds = (reducer as RootReducerWithCmds<AppState, Action>)(
                stateWithCmds,
                action
            );

            const { state: nextState, cmds: commands } = unwrapCmds(nextStateWithCmds);

            processCommands(commands);

            return nextState;
        }

        return newReducer;
    }

    return commandMetaReducer;
}
