import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { NgForm } from '@angular/forms';
import { ProductStateService } from '../../state/product-state.service';
import { UserStateService } from '../../../user/state/user-state.service';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
    @Input()
    product!: Product;

    @Input()
    detailTitle!: string;

    constructor(private productState: ProductStateService, public userState: UserStateService) {}

    ngOnInit(): void {}

    onClose() {
        this.productState.clearProduct();
    }

    submit(form: NgForm) {
        const newTodo: Product = {
            ...this.product,
            ...form.value,
        };

        if (newTodo.id) {
            this.productState.update(newTodo);
        } else {
            this.productState.create(newTodo);
        }
    }

    delete(product: Product) {
        this.productState.delete(product);
    }
}
