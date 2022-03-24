/* Defines the product entity */
export interface Product {
    id: number | undefined;
    productName: string;
    productCode: string;
    description: string;
    starRating: number;
    price: number | undefined;
}
