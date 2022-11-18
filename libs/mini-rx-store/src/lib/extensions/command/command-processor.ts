import { asapScheduler, observeOn, Subject } from 'rxjs';
import { Cmd, Cmd$, NOOP_CMD } from './command-models';

export class CommandProcessor {
    // COMMANDS
    private readonly commandsSource: Subject<Cmd>;
    readonly commands$: Cmd$;

    constructor() {
        this.commandsSource = new Subject<Cmd>();
        this.commands$ = this.commandsSource
            .asObservable()
            // do not run when next value is posted, schedule on next JS microtask,
            // _after_ other already posted microtasks, but _before_ next event fires with its callback
            .pipe(observeOn(asapScheduler));
    }

    process(commands: Cmd[]) {
        const relevantCmds = commands.filter((cmd) => cmd !== NOOP_CMD);

        console.log(`Received ${commands.length} command(s), ${relevantCmds.length} relevant`);

        if (relevantCmds.length == 0) {
            return;
        }

        for (const cmd of commands) {
            this.commandsSource.next(cmd);
        }
    }
}
