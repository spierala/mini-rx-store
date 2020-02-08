import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

import { UserStoreService } from './state/user-store.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  pageTitle = 'Log In';
  errorMessage: string;

  maskUserName: boolean;
  sub: Subscription;

  constructor(private store: UserStoreService,
              private authService: AuthService,
              private router: Router,
              private userStoreService: UserStoreService) { }

  ngOnInit(): void {
    this.sub = this.userStoreService.maskUserName$.subscribe(
      maskUserName => {
          this.maskUserName = maskUserName
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  cancel(): void {
    this.router.navigate(['welcome']);
  }

  checkChanged(value: boolean): void {
    this.userStoreService.updateMaskUserName(value);
  }

  login(loginForm: NgForm): void {
    if (loginForm && loginForm.valid) {
      const userName = loginForm.form.value.userName;
      const password = loginForm.form.value.password;
      this.authService.login(userName, password);

      if (this.authService.redirectUrl) {
        this.router.navigateByUrl(this.authService.redirectUrl);
      } else {
        this.router.navigate(['/products']);
      }
    } else {
      this.errorMessage = 'Please enter a user name and password.';
    }
  }
}
