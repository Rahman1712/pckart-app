import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../_model-dto/cart/cart';
import { CartResponse } from '../_model-dto/cart/cart-response';
import { User } from '../_model-dto/user/user';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AnnotatedSnackbarComponent } from '../_utils/annotated-snackbar/annotated-snackbar.component';
import { MatSnackBar, MatSnackBarRef, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ProductResponse } from '../_model-dto/product/product-response';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  private apiCartUrl = environment.apiCartUrl;

  snackbarRef: MatSnackBarRef<AnnotatedSnackbarComponent> | null;
  
  constructor(
    private http: HttpClient, 
    private auth_service: AuthService,
    private router: Router ,
    private _snackBar: MatSnackBar,
  ){ }

  /* ================================HTTP============================================ */
  public addCartByUser(cart: Cart): Observable<CartResponse>{
    return this.http.post<CartResponse>(`${this.apiCartUrl}/add`, cart);
  }

  // public updateCartById(cart: Cart, cartId: number): Observable<CartResponse>{
  //   return this.http.put<CartResponse>(`${this.apiCartUrl}/update/${cartId}`, cart);
  // }

  public updateCartQuantityById(cartId: number, quantity: number): Observable<string>{
    const params = {
      quantity : quantity,
    }
    return this.http.put(`${this.apiCartUrl}/update-cart-quantity/${cartId}`, null, {params: params, responseType : 'text'});
  }
  
  public deleteCartById(cartId: number): Observable<string> {
    return this.http.delete(`${this.apiCartUrl}/delete-cart/${cartId}`, { responseType: 'text' });
  }

  public getAllCartsByUserId(userId: number): Observable<CartResponse[]>{
    return this.http.get<CartResponse[]>(`${this.apiCartUrl}/get/carts/${userId}`);
  }

  public sendAndUpdate(userid: number, carts: Cart[]): Observable<CartResponse[]>{
    return this.http.put<CartResponse[]>(`${this.apiCartUrl}/getAndUpdate/${userid}`, carts);
  }

/* ============================================================================== */

/* ========================ADD TO CART============================== */
addToCart(product: ProductResponse, user: User) {
  if (!this.auth_service.loggedIn()) {
    // alert('please login');
    this.openSnackBar(`PLEASE LOGIN TO ADD TO CART`, true, 'top');

    const currentPath = this.router.url;
    console.log('Current path: ' + currentPath);
    this.router.navigate(['/login'], { queryParams: { returnUrl: currentPath } });

    return;
  }

  this.getAllCartsByUserId(user.id).subscribe(items => {
    const existingItem = items.find((cartItem) => cartItem.productId === product.productId);

    if (existingItem) {
      if (existingItem.quantity === product.productQuantity) {
        // alert("Quantity max reached");
        this.openSnackBar(`Quantity maximum reached . Only available ${product.productQuantity} no.s in stocck.`, true, 'bottom');
        return;
      }

      this.updateCartQuantityById(existingItem.cartId, existingItem.quantity + 1)
        .subscribe({
          next: (res: string) => {
            console.log(res);
            existingItem.quantity++;
            this.openSnackBar(`CART UPDATED ${product.productName} quantity changed to ${existingItem.quantity} `, false, 'bottom');
          },
          error: (error: HttpErrorResponse) => {
            console.log(error);
            this.openSnackBar('Failed to add cart', true, 'bottom');
            // alert(error.message)
          }
        });
    }
    else {
      const cart: Cart = new Cart();
      cart.id = 0;
      cart.productId = product.productId;
      cart.quantity = 1;
      cart.user = user;

      this.addCartByUser(cart)
        .subscribe({
          next: (cartResponse: CartResponse) => {
            console.log(cartResponse);
            this.openSnackBar(`${product.productName} added to cart`, false, 'bottom');
          },
          error: (error: HttpErrorResponse) => {
            console.log(error);
            this.openSnackBar('Failed to add cart', true, 'bottom');
            // alert(error.message)
          }
        });
    }
  });
}

/* =============================SNACKBAR================================================= */
  openSnackBar(message: string, isError:  boolean, verticalPosition: MatSnackBarVerticalPosition) {
    const durationInSeconds = 5;
    this.snackbarRef = this._snackBar.openFromComponent(AnnotatedSnackbarComponent, {
      duration: durationInSeconds * 1000,
      horizontalPosition: 'center',
      verticalPosition: verticalPosition,
    });
    this.snackbarRef.instance.snackMessage = message;
    this.snackbarRef.instance.isError = isError;
  }

/* ============================================================================== */
}




    