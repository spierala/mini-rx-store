import { StoreExtension } from './models';

export function sortExtensions<T extends StoreExtension>(extensions: T[]): T[] {
    return [...extensions].sort((a, b) => {
        return a.sortOrder - b.sortOrder;
    });
}
