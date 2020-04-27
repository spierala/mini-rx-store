import { createFeatureSelector, createSelector } from 'mini-rx-store';
import { Product } from '../product';

// State for this feature (Product)
export interface ProductState {
    showProductCode: boolean;
    currentProductId: number | null;
    products: Product[];
    error: string;
}

export const initialState: ProductState = {
    showProductCode: true,
    currentProductId: null,
    products: [],
    error: ''
};

// Selector functions
const getProductFeatureState = createFeatureSelector<ProductState>('products');

export const getShowProductCode = createSelector(
    getProductFeatureState,
    (state: ProductState) => state.showProductCode
);

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
