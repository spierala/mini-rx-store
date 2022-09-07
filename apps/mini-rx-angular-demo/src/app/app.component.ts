import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductStore } from './modules/products/state/product-store.service';
import { UserStore } from './modules/user/state/user-store.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    constructor(public productStore: ProductStore, public userStore: UserStore) {}
}
