import { ComponentStoreConfig, ComponentStoreExtension } from './models';
import { sortExtensions } from './sort-extensions';

function mergeComponentStoreExtensions(
    global: ComponentStoreExtension[],
    local: ComponentStoreExtension[]
): ComponentStoreExtension[] {
    // Local extensions overwrite the global extensions
    // If extension is global and local => use local
    // If extension is only global => use global
    // If extension is only local => use local

    const extensions: ComponentStoreExtension[] = [];
    let globalCopy = [...global];
    let localCopy = [...local];

    global.forEach((globalExt) => {
        local.forEach((localExt) => {
            if (localExt.id === globalExt.id) {
                // Found extension which is global and local
                extensions.push(localExt); // Use local!
                localCopy = localCopy.filter((item) => item.id !== localExt.id); // Remove found extension from local
                globalCopy = globalCopy.filter((item) => item.id !== globalExt.id); // Remove found extension from global
            }
        });
    });

    return [
        ...extensions, // Extensions which are global and local, but use local
        ...localCopy, // Local only
        ...globalCopy, // Global only
    ];
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
