import { Product } from '../models/product';
import { action, payload } from 'ts-action';

export const toggleProductCode = action('[Product] Toggle Product Code', payload<boolean>());
export const selectProduct = action('[Product] Select Product', payload<Product>());
export const clearCurrentProduct = action('[Product] Clear Current Product');
export const initializeNewProduct = action('[Product] Initialize New Product');

export const load = action('[Product] Load');
export const loadSuccess = action('[Product] Load Success', payload<Product[]>());
export const loadFail = action('[Product] Load Fail', payload<string>());

export const updateProduct = action('[Product] Update Product', payload<Product>());
export const updateProductOptimistic = action(
    '[Product] Update Product Optimistic',
    payload<Product>()
);
export const updateProductSuccess = action('[Product] Update Product Success', payload<Product>());
export const updateProductFail = action('[Product] Update Product Fail', payload<string>());

export const createProduct = action('[Product] Create Product', payload<Product>());
export const createProductSuccess = action('[Product] Create Product Success', payload<Product>());
export const createProductFail = action('[Product] Create Product Fail', payload<string>());

export const deleteProduct = action('[Product] Delete Product', payload<number>());
export const deleteProductSuccess = action('[Product] Delete Product Success', payload<number>());
export const deleteProductFail = action('[Product] Delete Product Fail', payload<string>());

export const updateSearch = action('[Product] Update Search', payload<string>());
export const addProductToCart = action('[Product] Add Product To Cart', payload<number>());
export const removeProductFromCart = action(
    '[Product] Remove Product From Cart',
    payload<number>()
);
