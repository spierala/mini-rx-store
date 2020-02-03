import { createFeatureSelector, createSelector } from 'mini-rx-store';
import { ProductState } from './product.reducer';

// Selector functions
const getProductFeatureState = createFeatureSelector<ProductState>('products');

export const getShowProductCode = createSelector(
    getProductFeatureState,
    (state: ProductState) => state.showProductCode
);

export const getCurrentProductId = createSelector(
    getProductFeatureState,
    (state: ProductState) => state.currentProductId
);

export const getCurrentProduct = createSelector(
    getProductFeatureState,
    getCurrentProductId,
    (state: ProductState, currentProductId: number) => {
        if (currentProductId === 0) {
            return {
                id: 0,
                productName: '',
                productCode: 'New',
                description: '',
                starRating: 0
            };
        } else {
            return currentProductId ? state.products.find(p => p.id === currentProductId) : null;
        }
    }
);

export const getProducts = createSelector(
    getProductFeatureState,
    (state: ProductState) => state.products
);

export const getError = createSelector(
    getProductFeatureState,
    (state: ProductState) => state.error
);
