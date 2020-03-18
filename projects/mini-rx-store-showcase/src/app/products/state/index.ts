import { createFeatureSelector, createSelector } from 'mini-rx-store';
import { ProductState } from './product.reducer';
import { Product } from '../product';

// Selector functions
const getProductFeatureState = createFeatureSelector<ProductState>('products');

export const getCurrentProductId = createSelector(
    getProductFeatureState,
    (state: ProductState) => state.currentProductId
);

export const getProducts = createSelector(
    getProductFeatureState,
    (state: ProductState) => {
        return state.products
    }
);

export const getCurrentProduct = createSelector(
    getProducts,
    getCurrentProductId,
    (products: Product[], currentProductId: number) => {
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

export const getError = createSelector(
    getProductFeatureState,
    (state: ProductState) => state.error
);
