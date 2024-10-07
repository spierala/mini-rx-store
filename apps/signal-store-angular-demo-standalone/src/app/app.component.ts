import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductsFacade } from './products/state/products-facade.service';
import { UserFacade } from './user/state/user-facade.service';

@Component({
    standalone: true,
    imports: [RouterModule],
    selector: 'mini-rx-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    productsFacade = inject(ProductsFacade);
    userFacade = inject(UserFacade);
}
