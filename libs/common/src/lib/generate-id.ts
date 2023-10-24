// Simple alpha numeric ID: https://stackoverflow.com/a/12502559/453959
// This isn't a real GUID!
export function generateId(): string {
    return Math.random().toString(36).slice(2);
}
