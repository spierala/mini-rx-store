import { createFeatureSelector, createSelector } from 'mini-rx-store';
import { ProductState } from './product.reducer';

// Selector functions
const getProductFeatureState = createFeatureSelector<ProductState>('products');

export const getCurrentProductId = createSelector(
    getProductFeatureState,
    state => state.currentProductId
);

export const getProducts = createSelector(
    getProductFeatureState,
    state => state.products
);

export const getCurrentProduct = createSelector(
    getProducts,
    getCurrentProductId,
    (products, currentProductId) => {
        if (currentProductId === 0) {
            return {
                id: 0,
                productName: '',
                productCode: 'New',
                description: '',
                starRating: 0
            };
        } else {
            return currentProductId ? products.find(p => p.id === currentProductId) : null;
        }
    }
);

export const getProductById = (id: number) => createSelector(
    getProducts,
    products => products.find(item => item.id === id)
);

export const getError = createSelector(
    getProductFeatureState,
    state => state.error
);
