import { Component,OnInit } from '@angular/core';
import { CartService } from '../_services/cart.service';
import { ProductService } from '../_services/product.service';
import { ImageProcessingServiceService } from '../_services/image-processing-service.service';
import { map } from 'rxjs';
import { ProductDTO } from '../_model-dto/product/product-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../_model-dto/user/user';
import { AuthService } from '../_services/auth.service';
import { CartResponse } from '../_model-dto/cart/cart-response';
import { Router } from '@angular/router';
import { ProductDetails } from '../_model-dto/product/product-details';
import { AlertBoxesComponent, AlertType } from '../_utils/alert-boxes/alert-boxes.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { AnnotatedSnackbarComponent } from '../_utils/annotated-snackbar/annotated-snackbar.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartResponseItems : CartResponse[] = [];

  dialogRef: MatDialogRef<AlertBoxesComponent> | null;
  snackbarRef: MatSnackBarRef<AnnotatedSnackbarComponent> | null;

  constructor(
    private cartService: CartService,
    private imageProcessingService: ImageProcessingServiceService,
    private productService: ProductService,
    private auth_service: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    ) { }

  cartLength : number;
  shipping: number = 0;

  ngOnInit() {
    this.cartResponseItems = [];
    this.getallCarts();
  }

  async getallCarts(){
    this.auth_service.getUserByUsername(this.auth_service.getUsername()!)
    .subscribe({
      next: (user: User) =>{
        this.cartService.getAllCartsByUserId(user.id)
        .pipe(
          map((carts: CartResponse[]) => {
            carts.forEach((cart) =>{       
              this.getAllProductsByCartItem(cart);
            })
            return carts;
          })
        )
        .subscribe({
          next: (cartList: CartResponse[]) =>{
            console.log(cartList);
            if(cartList != null){
              this.cartResponseItems = cartList;
              // alert(this.cartResponseItems)
              // this.cartLength = cartList.length;
            }
          }
        });
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        alert(error.message);
      }
    });
  }

  getAllProductsByCartItem(cartResponse: CartResponse) {

    this.productService.getProductDetailsMainImageById(cartResponse.productId)
      .pipe(
        map((product: ProductDTO<any,any>) => 
          this.imageProcessingService.createMainImageToProdDto(product)
        )
      )
      .subscribe({
        next: (next: ProductDTO<any,any>) =>{
          this.productService.getParentCategoryNameByCategory(next.productResponse.categoryName)
            .subscribe( parentName => {
              cartResponse.productResponse = next.productResponse;
              cartResponse.productResponse.parentCategoryName = parentName;
          })
        },
        error: (error: HttpErrorResponse) =>{
          alert(error.message)
          console.log(error)
        }
      });
  }

  removeFromCart(cartRes: CartResponse, index: number) {  //removeFromCart(item: any) {
   
    this.dialogRef = this.dialog.open(AlertBoxesComponent, {
      disableClose: true
    });
    this.dialogRef.componentInstance.alertType = AlertType.CONFIRMATION;
    this.dialogRef.componentInstance.conform_title = "Remove Cart Item ?";
    this.dialogRef.componentInstance.conform_message = "Do you want delete cart Item ?";

    this.dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.cartService.deleteCartById(cartRes.cartId)
          .subscribe({
            next: (res: string) => {
              console.log(res);
              this.auth_service.setCartLength(Number(this.auth_service.getCartLength())-1);
              this.cartResponseItems?.splice(index,1);
              this.openSnackBar(`${cartRes.productResponse.productName} removed from cart`, false);
            },
            error: (error: HttpErrorResponse) => { 
              alert(error.message); 
              console.log(error);
            }
        });
      }

      this.dialogRef = null;
    });
  }
  
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

  incrementQuantity(item: CartResponse)  {
    if(item.quantity === item.productResponse.productQuantity){
      // alert("Quantity max reached");
      this.dialogRef = this.dialog.open(AlertBoxesComponent, {
        disableClose: true
      });
      this.dialogRef.componentInstance.alertType = AlertType.INFO;
      this.dialogRef.componentInstance.info_title = "info";
      this.dialogRef.componentInstance.info_message = `Quantity maximum reached . Only available in stock ${item.productResponse.productQuantity} no.s Quantity`;
      this.dialogRef.componentInstance.info_color = "warn";

      this.dialogRef.afterClosed().subscribe(result => {
        this.dialogRef = null;
      });

      return;
    }

    this.cartService.updateCartQuantityById(item.cartId, item.quantity + 1)
      .subscribe({
        next: (res: string) => {
          item.quantity++;
          console.log(res)
        },
        error: (error: HttpErrorResponse) => {
          console.log(error)
          alert(error.message)
        }
      });
  }

  decrementQuantity(item: CartResponse) {
    if (item.quantity > 1) {
        this.cartService.updateCartQuantityById(item.cartId, item.quantity-1)
        .subscribe({
          next: (res: string) =>{
            item.quantity--;
            console.log(res)
          },
          error: (error: HttpErrorResponse) =>{
            console.log(error)
            alert(error.message)
          }
        });
    }
  }

  calculateSubtotal(): number {
    let subtotal = 0;

    for (const cartItem of this.cartResponseItems) {
      subtotal += cartItem.quantity * cartItem.productResponse.productPrice;
    }
    
    this.shipping = subtotal > 1000 ? 0 : 50; 

    return subtotal;
  }

  viewProductDetails(productParentCategory: string, productCategory: string, productId: number){
    this.router.navigate([`/product-detail/${productParentCategory}/${productCategory}/product`, {productId: productId}]);
  }


  

}
