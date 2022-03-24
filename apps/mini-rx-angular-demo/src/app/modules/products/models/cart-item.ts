export class CartItem {
    productId: number | undefined;
    amount: number = 0;

    // UI only
    productName?: string;
    total?: number;
}
