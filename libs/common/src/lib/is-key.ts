export function isKey<T extends object>(obj: T, k: PropertyKey): k is keyof T {
    return k in obj;
}
