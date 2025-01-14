export class CartItem {
    productId: number | undefined;
    amount = 0;

    // UI only
    productName?: string;
    total?: number;
}
