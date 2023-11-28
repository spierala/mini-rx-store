import { ComponentStoreConfig, ComponentStoreExtension } from './models';
import { sortExtensions } from './sort-extensions';

function mergeComponentStoreExtensions(
    globalExtensions: ComponentStoreExtension[],
    localExtensions: ComponentStoreExtension[]
): ComponentStoreExtension[] {
    // Local extensions overwrite the global extensions
    // If extension is global and local => use local
    // If extension is only global => use global
    // If extension is only local => use local
    // In other words: Always use local, but also add global-only extensions
    const globalOnlyExtensions = globalExtensions.reduce<ComponentStoreExtension[]>(
        (accumulated, globalExt) => {
            const hasFoundGlobalOnlyExtension = !localExtensions.find(
                (localExt) => localExt.id === globalExt.id
            );
            return hasFoundGlobalOnlyExtension ? [...accumulated, globalExt] : accumulated;
        },
        []
    );

    return [...localExtensions, ...globalOnlyExtensions];
}

export function calculateExtensions(
    localConfig?: ComponentStoreConfig,
    globalConfig?: ComponentStoreConfig
): ComponentStoreExtension[] {
    let extensions: ComponentStoreExtension[] = [];

    if (localConfig?.extensions) {
        if (localConfig.extensions && globalConfig?.extensions) {
            extensions = mergeComponentStoreExtensions(
                globalConfig.extensions,
                localConfig.extensions
            );
        } else {
            extensions = localConfig.extensions;
        }
    } else if (globalConfig?.extensions) {
        extensions = globalConfig.extensions;
    }
    return sortExtensions(extensions);
}
