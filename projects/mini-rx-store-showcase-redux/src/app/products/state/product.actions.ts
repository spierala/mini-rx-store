import { Product } from '../product';
import { action, payload } from 'ts-action';

export const toggleProductCode = action('[Product] Toggle Product Code', payload<boolean>());
export const setCurrentProduct = action('[Product] Set Current Product', payload<Product>());
export const clearCurrentProduct = action('[Product] Clear Current Product');
export const initializeCurrentProduct = action('[Product] Initialize Current Product');

export const load = action('[Product] Load');
export const loadSuccess = action('[Product] Load Success', payload<Product[]>());
export const loadFail = action('[Product] Load Fail', payload<string>());

export const updateProduct = action('[Product] Update Product', payload<Product>());
export const updateProductSuccess = action('[Product] Update Product Success', payload<Product>());
export const updateProductFail = action('[Product] Update Product Fail', payload<string>());

export const createProduct = action('[Product] Create Product', payload<Product>());
export const createProductSuccess = action('[Product] Create Product Success', payload<Product>());
export const createProductFail = action('[Product] Create Product Fail', payload<string>());

export const deleteProduct = action('[Product] Delete Product', payload<number>());
export const deleteProductSuccess = action('[Product] Delete Product Success', payload<number>());
export const deleteProductFail = action('[Product] Delete Product Fail', payload<string>());
