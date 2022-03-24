import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserShellComponent } from './components/user-shell/user-shell.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [UserShellComponent],
    imports: [CommonModule, FormsModule],
})
export class UserModule {}
