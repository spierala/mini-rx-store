import { generateId } from './generate-id';

export function generateFeatureKey(featureKey: string, multi?: boolean) {
    return multi ? featureKey + '-' + generateId() : featureKey;
}
