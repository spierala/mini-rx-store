import {
    addProductToCart,
    clearCurrentProduct,
    createProductSuccess,
    deleteProductSuccess,
    initializeNewProduct,
    loadFail,
    loadSuccess,
    removeProductFromCart,
    selectProduct,
    toggleProductCode,
    updateProductOptimistic,
    updateProductSuccess,
    updateSearch,
} from './products.actions';
import { on, reducer } from 'ts-action';
import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';

// STATE INTERFACE
export interface ProductState {
    showProductCode: boolean;
    selectedProduct: Product | undefined;
    products: Product[];
    search: string;
    cart: CartItem[];
}

// INITIAL STATE
const initialState: ProductState = {
    showProductCode: true,
    selectedProduct: undefined,
    products: [],
    search: '',
    cart: [
        {
            productId: 1,
            amount: 1,
        },
    ],
};

// REDUCER
export const productsReducer = reducer<ProductState>(
    initialState,
    on(toggleProductCode, (state, { payload }) => ({ ...state, showProductCode: payload })),
    on(selectProduct, (state, { payload }) => ({ ...state, selectedProduct: payload })),
    on(clearCurrentProduct, (state) => ({ ...state, selectedProduct: undefined })),
    on(initializeNewProduct, (state) => ({ ...state, selectedProduct: new Product() })),
    on(loadSuccess, (state, { payload }) => ({
        ...state,
        products: payload,
    })),
    on(loadFail, (state, { payload }) => ({
        ...state,
        products: [],
    })),
    on(updateProductOptimistic, (state, { payload }) => {
        const updatedProducts = state.products.map((item) =>
            payload.id === item.id ? payload : item
        );
        return {
            ...state,
            products: updatedProducts,
        };
    }),
    on(updateProductSuccess, (state, { payload }) => {
        const updatedProducts = state.products.map((item) =>
            payload.id === item.id ? payload : item
        );
        return {
            ...state,
            products: updatedProducts,
        };
    }),
    on(createProductSuccess, (state, { payload }) => ({
        ...state,
        products: [...state.products, payload],
        selectedProduct: payload,
    })),
    on(deleteProductSuccess, (state, { payload }) => ({
        ...state,
        products: state.products.filter((product) => product.id !== payload),
        selectedProduct: undefined,
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
