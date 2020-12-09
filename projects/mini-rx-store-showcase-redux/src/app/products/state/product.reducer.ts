import { Product } from '../product';
import {
    clearCurrentProduct,
    createProductFail,
    createProductSuccess,
    deleteProductFail,
    deleteProductSuccess,
    initializeCurrentProduct,
    loadFail,
    loadSuccess,
    setCurrentProduct,
    toggleProductCode,
    updateProductFail,
    updateProductSuccess,
} from './product.actions';
import { on, reducer } from 'ts-action';

// State for this feature (Product)
export interface ProductState {
    showProductCode: boolean;
    currentProductId: number | null;
    products: Product[];
    error: string;
}

const initialState: ProductState = {
    showProductCode: true,
    currentProductId: null,
    products: [],
    error: '',
};

export const productReducer = reducer(
    initialState,
    on(toggleProductCode, (state, { payload }) => ({ ...state, showProductCode: payload })),
    on(setCurrentProduct, (state, { payload }) => ({ ...state, currentProductId: payload.id })),
    on(clearCurrentProduct, (state) => ({ ...state, currentProductId: null })),
    on(initializeCurrentProduct, (state) => ({ ...state, currentProductId: 0 })),
    on(loadSuccess, (state, { payload }) => ({
        ...state,
        products: payload,
        error: '',
    })),
    on(loadFail, (state, { payload }) => ({
        ...state,
        products: [],
        error: payload,
    })),
    on(updateProductSuccess, (state, { payload }) => {
        const updatedProducts = state.products.map((item) =>
            payload.id === item.id ? payload : item
        );
        return {
            ...state,
            products: updatedProducts,
            currentProductId: payload.id,
            error: '',
        };
    }),
    on(updateProductFail, (state, { payload }) => ({
        ...state,
        error: payload,
    })),
    on(createProductSuccess, (state, { payload }) => ({
        ...state,
        products: [...state.products, payload],
        currentProductId: payload.id,
        error: '',
    })),
    on(createProductFail, (state, { payload }) => ({
        ...state,
        error: payload,
    })),
    on(deleteProductSuccess, (state, { payload }) => ({
        ...state,
        products: state.products.filter((product) => product.id !== payload),
        currentProductId: null,
        error: '',
    })),
    on(deleteProductFail, (state, { payload }) => ({
        ...state,
        error: payload,
    }))
);
