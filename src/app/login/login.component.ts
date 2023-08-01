import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationRequest } from '../_model-dto/auth/authentication-request';
import { AuthenticationResponse } from '../_model-dto/auth/authentication-response';
import { CartService } from '../_services/cart.service';
import { WishService } from '../_services/wish.service';
import { UserserviceService } from '../_services/userservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private _auth: AuthService,
     private _router: Router,
      private route: ActivatedRoute,
      private cartService: CartService,
      private wishService: WishService,
      ){}

  adminLoginDetail:AuthenticationRequest = new AuthenticationRequest();
  // token!: AuthenticationResponse;
  loginError: boolean = false;
  errorMsg: string = 'error';
  loggedOut: boolean = false;

  loginUser(){
    this._auth.clear()
    //console.log(this.adminLoginDetail)
    this._auth.loginUser(this.adminLoginDetail)
    .subscribe(
      { 
        next: (next:AuthenticationResponse) => {
          console.log(next)
          // this._auth.setToken(next.token);
          this._auth.setToken(next.access_token);
          this._auth.setRefreshToken(next.refresh_token);
          this._auth.setUserName(next.username)
          this._auth.setRole(next.role);

          // this._router.navigate(['/'])
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this._router.navigateByUrl(returnUrl);
          
          this.loggedOut = false;
          this.loginError = false;

          // this.cartService.loggedInUpdationCart();
          this.wishService.loggedInUpdationWish();

          this._auth.getUserByUsername(next.username)
          .subscribe(user=> { this._auth.setFullName(user.fullname);});
        },
        error: (error: HttpErrorResponse) => {
          this.loginError = true;
          this.errorMsg = error.error.errorMessage
        }
      }
    );
  }

  isErrorOnLogin(){
    return this.loginError;
  }

  isLoggedOut(){
    return this.loggedOut;
  }
}


 /*
  loginUser(){
    console.log(this.adminLoginDetail)
    this._auth.loginUser(this.adminLoginDetail)
    .subscribe(
      { 
        next: next => {
          console.log(next)
          localStorage.setItem('token', next.token)
        },
        error: console.error
      }
    );
  }
  */
  // loginUser(){
  //   console.log(this.adminLoginDetail)
  //   this._auth.loginUser(this.adminLoginDetail)
  //     .subscribe(
  //       (response: AuthenticatorResponse) =>{
  //         console.log(response)
  //         this.token = response;
  //       },
  //       (error: HttpErrorResponse) =>{
  //         console.log(error)
  //         alert(error.message);
  //       }
  //     )
  // }