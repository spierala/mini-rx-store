// Copied from with small modifications: https://github.com/jsdf/deep-freeze/blob/v1.1.1/index.js

// Original License:
// This software is released to the public domain.
//
// It is based in part on the deepFreeze function from:
// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/freeze
//
// https://developer.mozilla.org/en-US/docs/Project:Copyrights

import { isFunction } from './is-function';

export function deepFreeze(o: any) {
    Object.freeze(o);

    const oIsFunction = isFunction(o);
    const hasOwnProp = Object.prototype.hasOwnProperty;

    Object.getOwnPropertyNames(o).forEach(function (prop) {
        if (
            hasOwnProp.call(o, prop) &&
            (oIsFunction ? prop !== 'caller' && prop !== 'callee' && prop !== 'arguments' : true) &&
            o[prop] !== null &&
            (typeof o[prop] === 'object' || isFunction(o[prop])) &&
            !Object.isFrozen(o[prop])
        ) {
            deepFreeze(o[prop]);
        }
    });

    return o;
}
