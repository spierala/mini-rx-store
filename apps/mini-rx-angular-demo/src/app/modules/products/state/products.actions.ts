import { Product } from '../models/product';
import { action, payload } from 'ts-action';

export const toggleProductCode = action('[Products] Toggle Product Code', payload<boolean>());
export const selectProduct = action('[Products] Select Product', payload<Product>());
export const clearCurrentProduct = action('[Products] Clear Current Product');
export const initializeNewProduct = action('[Products] Initialize New Product');

export const load = action('[Products] Load');
export const loadSuccess = action('[Products] Load Success', payload<Product[]>());
export const loadFail = action('[Products] Load Fail', payload<string>());

export const updateProduct = action('[Products] Update Product', payload<Product>());
export const updateProductOptimistic = action(
    '[Products] Update Product Optimistic',
    payload<Product>()
);
export const updateProductSuccess = action('[Products] Update Product Success', payload<Product>());
export const updateProductFail = action('[Products] Update Product Fail', payload<string>());

export const createProduct = action('[Products] Create Product', payload<Product>());
export const createProductSuccess = action('[Products] Create Product Success', payload<Product>());
export const createProductFail = action('[Products] Create Product Fail', payload<string>());

export const deleteProduct = action('[Products] Delete Product', payload<number>());
export const deleteProductSuccess = action('[Products] Delete Product Success', payload<number>());
export const deleteProductFail = action('[Products] Delete Product Fail', payload<string>());

export const updateSearch = action('[Products] Update Search', payload<string>());
export const addProductToCart = action('[Products] Add Product To Cart', payload<number>());
export const removeProductFromCart = action(
    '[Products] Remove Product From Cart',
    payload<number>()
);
