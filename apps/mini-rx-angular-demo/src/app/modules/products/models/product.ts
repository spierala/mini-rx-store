/* Defines the product entity */
export class Product {
    id: number | undefined;
    productName: string = '';
    productCode: string = 'New';
    description: string = '';
    starRating: number = 0;
    price: number | undefined;
}
