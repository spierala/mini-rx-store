import { ComponentStoreExtension, MetaReducer, StoreExtension } from '../../models';
import { ExtensionId } from '../../enums';
import { loggerMetaReducer } from './logger-meta-reducer';

export class LoggerExtension extends StoreExtension implements ComponentStoreExtension {
    id = ExtensionId.LOGGER;
    hasCsSupport = true as const;

    init(): MetaReducer<any> {
        return loggerMetaReducer;
    }
}
