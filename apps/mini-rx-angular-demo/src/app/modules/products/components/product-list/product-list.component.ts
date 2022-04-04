import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
    @Input()
    products: Product[] = [];

    @Input()
    selectedProduct: Product | undefined;

    @Input()
    displayCode = false;

    @Input()
    showCartBtn = false;

    @Output()
    productSelect: EventEmitter<Product> = new EventEmitter<Product>();

    @Output()
    displayCodeChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output()
    addToCart: EventEmitter<Product> = new EventEmitter<Product>();
}
