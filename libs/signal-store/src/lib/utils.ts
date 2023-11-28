import { isSignal, Signal } from '@angular/core';

export function defaultSignalEquality(a: any, b: any) {
    return a === b;
}

export function miniRxIsSignal(v: any): v is Signal<any> {
    return isSignal(v);
}
