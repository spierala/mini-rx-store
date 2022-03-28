import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductStateService } from './modules/products/state/product-state.service';
import { UserStateService } from './modules/user/state/user-state.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    constructor(public productState: ProductStateService, public userState: UserStateService) {}
}
