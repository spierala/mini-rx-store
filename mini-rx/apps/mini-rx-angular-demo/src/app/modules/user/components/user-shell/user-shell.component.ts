import { Component, OnInit } from '@angular/core';
import { UserStateService } from '../../state/user-state.service';

@Component({
    selector: 'app-user-shell',
    templateUrl: './user-shell.component.html',
    styleUrls: ['./user-shell.component.css'],
})
export class UserShellComponent implements OnInit {
    constructor(public userState: UserStateService) {}

    ngOnInit(): void {}
}
