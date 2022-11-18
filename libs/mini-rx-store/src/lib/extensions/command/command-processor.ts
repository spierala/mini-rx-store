import { asapScheduler, filter, observeOn, Subject } from 'rxjs';
import { defaultEffectsErrorHandler } from '../../default-effects-error-handler';
import { Action } from '../../models';
import StoreCore from '../../store-core';
import { Cmd, Cmd$, CmdEffect, CmdEffectOutput, isCmd, NOOP_CMD } from './command-models';

function hasStringType(arg: any) {
    return typeof arg === 'object' && arg !== null && typeof arg.type === 'string';
}

function isAction(result: CmdEffectOutput): result is Action {
    if (typeof result === 'undefined') {
        return false;
    } else if (isCmd(result)) {
        return false;
    } else if (hasStringType(result)) {
        return true;
    } else {
        return false;
    }
}

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

        //console.log(`Received ${commands.length} command(s), ${relevantCmds.length} relevant`);

        if (relevantCmds.length == 0) {
            return;
        }

        for (const cmd of commands) {
            this.commandsSource.next(cmd);
        }
    }

    addEffect(effect$: CmdEffect): void {
        const effectWithErrorHandler$ = defaultEffectsErrorHandler(effect$);

        effectWithErrorHandler$.pipe(filter(isAction)).subscribe((action) => {
            StoreCore.dispatch(action);
        });
    }
}
