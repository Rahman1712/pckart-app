import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Wish } from '../_model-dto/wish/wish';
import { WishResponse } from '../_model-dto/wish/wish-response';
import { map } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../_model-dto/user/user';
import { AnnotatedSnackbarComponent } from '../_utils/annotated-snackbar/annotated-snackbar.component';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { ProductResponse } from '../_model-dto/product/product-response';

@Injectable({
  providedIn: 'root'
})
export class WishService {

  private apiWishUrl = environment.apiWishUrl;

  private wishItems: Wish[] = [];  // private wishItems:any[] = [];
  // private cartItemsSubject = new BehaviorSubject<any[]>(this.cartItems);
  private wishItemsSubject = new BehaviorSubject<Wish[]>(this.wishItems);
  private storageKey = 'wishItems';

  snackbarRef: MatSnackBarRef<AnnotatedSnackbarComponent> | null;

  constructor(
    private http: HttpClient,
    private auth_service: AuthService,
    private _snackBar: MatSnackBar,
  ) { 
    // Retrieve wish items from LocalStorage if available
    const storedWishItems = localStorage.getItem(this.storageKey);
    if (storedWishItems) {
      this.wishItems = JSON.parse(storedWishItems);
      this.wishItemsSubject.next(this.wishItems);
    }
  }

/* =====================================HTTP======================================================= */
  public addWishByUser(wish: Wish): Observable<WishResponse>{
    return this.http.post<WishResponse>(`${this.apiWishUrl}/add`, wish);
  }
  
  public deleteWishById(wishId: number): Observable<string> {
    return this.http.delete(`${this.apiWishUrl}/delete-wish/${wishId}`, { responseType: 'text' });
  }
  
  public getAllWishesByUserId(userId: number): Observable<WishResponse[]>{
    return this.http.get<WishResponse[]>(`${this.apiWishUrl}/get/wishs/${userId}`);
  }

  public sendAndUpdate(userid: number, wishs: Wish[]): Observable<WishResponse[]>{
    return this.http.put<WishResponse[]>(`${this.apiWishUrl}/getAndUpdate/${userid}`, wishs);
  }
/* ==========================================LOCAL STORAGE OP============================================= */
  getWishItems(): Observable<Wish[]> {
    return this.wishItemsSubject.asObservable();
  }

  getWishItemsLength(): Observable<number> {
    return this.wishItemsSubject.pipe(
      map(wishItems => wishItems.length)
    );
  }

  private saveWishItemsToLocalStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.wishItems));
  }
/* =================================GETALL AT LOGIN==================================================== */
  loggedInUpdationWish(){
    this.auth_service.getUserByUsername(this.auth_service.getUsername()!)
    .subscribe({
      next: (user: User) =>{
        this.wishItems.forEach(wish => {
          wish.user = user
        })
        this.sendAndUpdate(user.id, this.wishItems)
        .pipe(
          map((x: WishResponse[] , i) => 
            x.map((wishRes: WishResponse) => {
              let wish: Wish = new Wish();
              wish.id = wishRes.wishId;
              wish.productId = wishRes.productId;
              wish.user = user;
              return wish;
            })
          )
        )
        .subscribe({
          next: (wishList: Wish[]) =>{
            console.log(wishList);
            if(wishList != null){
              this.wishItems = wishList;
              this.wishItemsSubject.next(this.wishItems);
              this.saveWishItemsToLocalStorage();
            }
          }
        })
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        alert(error.message)
      }
    })
  }
/* ======================================ADD TO WISH==================================================== */
  addToWish(product: ProductResponse, user: User) {
    const existingItem = this.wishItems.find((wishItem: Wish) => wishItem.productId === product.productId);
    if (existingItem) {
      // alert('already in wish')
      this.removeFromWish(existingItem); // remove from wish
      return;
    }
    const wish: Wish = new Wish();
    wish.id = 0;
    wish.productId = product.productId;
    wish.user = user;

    this.wishItems.push(wish);

    if(this.auth_service.loggedIn()){
      this.addWishByUser(wish)
      .subscribe({
        next: (wishResponse: WishResponse) =>{
          console.log(wishResponse)
        },
        error: (error: HttpErrorResponse) =>{
          console.log(error)
          alert(error.message)
        }
      });
    }

    this.openSnackBar(`${product.productName} added to wish`, false);

    this.wishItemsSubject.next(this.wishItems);
    this.saveWishItemsToLocalStorage();
  }
/* ======================================REMOVE================================================== */
  async removeFromWish(wish: Wish) {
    const index = this.wishItems.indexOf(wish);
    if (index > -1) {
      if(this.auth_service.loggedIn()){ 
        this.deleteWishById(wish.id)
        .subscribe({
          next: (res: string) => {console.log(res);},
          error: (error: HttpErrorResponse) => { alert(error.message); console.log(error);}
        });
      }

      this.wishItems.splice(index, 1);
      this.wishItemsSubject.next(this.wishItems);
      this.saveWishItemsToLocalStorage();

      this.openSnackBar(`product removed from cart`, false);
    }
  }
/* =====================================WISH CHECK==================================================== */
  isInWishList(productId: number): boolean{
    const existingItem = this.wishItems.find((wishItem: Wish) => wishItem.productId === productId);
    return !!existingItem;
  }

/* ============================================================================================ */
  clearWish(){
    this.wishItems = [];
    this.wishItemsSubject.next(this.wishItems);
    this.saveWishItemsToLocalStorage();
  }

/* =============================SNACKBAR================================================= */
openSnackBar(message: string, isError:  boolean) {
  const durationInSeconds = 5;
  this.snackbarRef = this._snackBar.openFromComponent(AnnotatedSnackbarComponent, {
    duration: durationInSeconds * 1000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  });
  this.snackbarRef.instance.snackMessage = message;
  this.snackbarRef.instance.isError = isError;
}

/* ============================================================================== */

}
