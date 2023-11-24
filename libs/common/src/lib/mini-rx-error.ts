import { miniRxNameSpace } from './constants';

export function miniRxError(message: string): never {
    throw new Error(miniRxNameSpace + ': ' + message);
}
