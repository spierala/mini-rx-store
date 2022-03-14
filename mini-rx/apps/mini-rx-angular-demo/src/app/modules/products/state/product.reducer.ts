import {
    addProductToCart,
    clearCurrentProduct,
    createProductFail,
    createProductSuccess,
    deleteProductFail,
    deleteProductSuccess,
    initializeCurrentProduct,
    loadFail,
    loadSuccess,
    removeProductFromCart,
    setCurrentProduct,
    toggleProductCode,
    updateProductFail,
    updateProductOptimistic,
    updateProductSuccess,
    updateSearch,
} from './product.actions';
import { on, reducer } from 'ts-action';
import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';

// State for this feature (Product)
export interface ProductState {
    showProductCode: boolean;
    currentProductId: number | undefined;
    products: Product[];
    error: string;
    search: string;
    cart: CartItem[];
}

const initialState: ProductState = {
    showProductCode: true,
    currentProductId: undefined,
    products: [],
    error: '',
    search: '',
    cart: [
        {
            productId: 1,
            amount: 1,
        },
    ],
};

export const productReducer = reducer<ProductState>(
    initialState,
    on(toggleProductCode, (state, { payload }) => ({ ...state, showProductCode: payload })),
    on(setCurrentProduct, (state, { payload }) => ({ ...state, currentProductId: payload })),
    on(clearCurrentProduct, (state) => ({ ...state, currentProductId: undefined })),
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
    on(updateProductOptimistic, (state, { payload }) => {
        const updatedProducts = state.products.map((item) =>
            payload.id === item.id ? payload : item
        );
        return {
            ...state,
            products: updatedProducts,
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
        currentProductId: undefined,
        error: '',
    })),
    on(deleteProductFail, (state, { payload }) => ({
        ...state,
        error: payload,
    })),
    on(updateSearch, (state, { payload }) => ({
        ...state,
        search: payload,
    })),
    on(addProductToCart, (state, { payload }) => ({
        ...state,
        cart: addOrUpdateCartItem(state.cart, payload),
    })),
    on(removeProductFromCart, (state, { payload }) => ({
        ...state,
        cart: state.cart.filter((item) => item.productId !== payload),
    }))
);

function addOrUpdateCartItem(items: CartItem[], productId: number): CartItem[] {
    const itemExists = items.some((item) => item.productId === productId);
    if (itemExists) {
        return items.map((item) =>
            item.productId === productId ? { ...item, amount: item.amount + 1 } : item
        );
    }
    return [...items, { productId, amount: 1 }];
}
