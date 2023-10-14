import { ComponentStoreConfig } from './models';
import { miniRxError } from './mini-rx-error';

export function componentStoreConfig() {
    let componentStoreConfig: ComponentStoreConfig | undefined = undefined;

    // This function exists for testing purposes only
    function reset() {
        componentStoreConfig = undefined;
    }

    function set(config: ComponentStoreConfig) {
        if (!componentStoreConfig) {
            componentStoreConfig = config;
            return;
        }
        miniRxError('`configureComponentStores` was called multiple times.');
    }

    function get(): ComponentStoreConfig | undefined {
        return componentStoreConfig;
    }

    return {
        set,
        get,
        _resetConfig: reset,
    };
}
