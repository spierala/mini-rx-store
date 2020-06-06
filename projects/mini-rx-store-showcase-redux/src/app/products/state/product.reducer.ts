import { Product } from '../product';
import {
    toggleProductCode,
    setCurrentProduct,
    deleteProductSuccess,
    updateProductFail,
    loadSuccess,
    deleteProductFail,
    updateProductSuccess,
    clearCurrentProduct,
    createProductSuccess,
    createProductFail,
    initializeCurrentProduct, loadFail
} from './product.actions';
import { Action } from 'mini-rx-store';

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

export function reducer(state = initialState, action: Action): ProductState {

  switch (action.type) {
    case toggleProductCode.type:
      return {
        ...state,
        showProductCode: action.payload
      };

    case setCurrentProduct.type:
      return {
        ...state,
        currentProductId: action.payload.id
      };

    case clearCurrentProduct.type:
      return {
        ...state,
        currentProductId: null
      };

    case initializeCurrentProduct.type:
      return {
        ...state,
        currentProductId: 0
      };

    case loadSuccess.type:
      return {
        ...state,
        products: action.payload,
        error: ''
      };

    case loadFail.type:
      return {
        ...state,
        products: [],
        error: action.payload
      };

    case updateProductSuccess.type:
      const updatedProducts = state.products.map(
        item => action.payload.id === item.id ? action.payload : item);
      return {
        ...state,
        products: updatedProducts,
        currentProductId: action.payload.id,
        error: ''
      };

    case updateProductFail.type:
      return {
        ...state,
        error: action.payload
      };

    // After a create, the currentProduct is the new product.
    case createProductSuccess.type:
      return {
        ...state,
        products: [...state.products, action.payload],
        currentProductId: action.payload.id,
        error: ''
      };

    case createProductFail.type:
      return {
        ...state,
        error: action.payload
      };

    // After a delete, the currentProduct is null.
    case deleteProductSuccess.type:
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload),
        currentProductId: null,
        error: ''
      };

    case deleteProductFail.type:
      return {
        ...state,
        error: action.payload
      };

    default:
      return state;
  }
}
