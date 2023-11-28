export function isFunction(v: any): v is (...args: any[]) => any {
    return typeof v === 'function';
}
