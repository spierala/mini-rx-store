import { StoreExtension } from './models';

export function sortExtensions<T extends StoreExtension>(extensions: T[]): T[] {
    // TODO can be `toSorted` (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted) when available in TS
    return [...extensions].sort((a, b) => {
        return a.sortOrder - b.sortOrder;
    });
}
