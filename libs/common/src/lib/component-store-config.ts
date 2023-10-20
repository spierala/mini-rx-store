import { ComponentStoreConfig } from './models';
import { miniRxError } from './mini-rx-error';

export function componentStoreConfig() {
    let componentStoreConfig: ComponentStoreConfig | undefined = undefined;

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
    };
}
