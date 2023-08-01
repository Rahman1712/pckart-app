import { Component, OnInit } from '@angular/core';
import { ProductDTO } from '../_model-dto/product/product-dto';
import { ProductService } from '../_services/product.service';
import { ImageProcessingServiceService } from '../_services/image-processing-service.service';
import { map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { WishService } from '../_services/wish.service';
import { Wish } from '../_model-dto/wish/wish';
import { Router } from '@angular/router';
import { User } from '../_model-dto/user/user';
import { AuthService } from '../_services/auth.service';
import { UserserviceService } from '../_services/userservice.service';
import { CartService } from '../_services/cart.service';

@Component({
  selector: 'app-wish',
  templateUrl: './wish.component.html',
  styleUrls: ['./wish.component.css']
})
export class WishComponent implements OnInit {

  wishItems: Wish[] = [];  //wishItems: any[] = [];
  productsListImgs: ProductDTO<any,any>[] = [];

  user : User | undefined = undefined;

  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessingServiceService,
    private wishService: WishService,
    private router: Router,
    private auth_service: AuthService,
    private user_service: UserserviceService,
    private cartService: CartService,
  ){}

  ngOnInit() {
    this.wishService.getWishItems().subscribe(items => {
      this.productsListImgs = [];  // to null because abow subscribe is observable
      this.wishItems = items;
      this.wishItems.forEach( wish => {
        this.getAllProductsByWishItem(wish);
      });
    });

    if(this.auth_service.loggedIn()){
      this.user_service.getUserByUsername(this.auth_service.getUsername()!)
      .subscribe({
        next:(userRes: User) => {
          this.user = userRes;
        },
        error: (error: HttpErrorResponse) =>{
          console.log(error);
          alert(error.message);
        }
      })
    }
  }
  
  getAllProductsByWishItem(wish: Wish) {
    this.productService.getProductDetailsMainImageById(wish.productId)
      .pipe(
        map((product: ProductDTO<any,any>) => 
            this.imageProcessingService.createMainImageToProdDto(product)
        )
      )
      .subscribe({
        next: (next: ProductDTO<any,any>) =>{
          this.productService.getParentCategoryNameByCategory(next.productResponse.categoryName)
          .subscribe( parentName => {
            next.productResponse.parentCategoryName = parentName;
            this.productsListImgs!.push(next);
            console.log(next)
          });
        },
        error: (error: HttpErrorResponse) =>{
          console.log(error);
          alert(error.message);
        }
      });
  }

  removeFromWish(productId: number, index: number) {  // removeFromWish(item: any) {
    const wish = this.wishItems.find((wishItem) => wishItem.productId === productId);
    this.wishService.removeFromWish(wish!).then(res =>{
      this.productsListImgs?.splice(index,1);
    });
  }

  viewProductDetails(productParentCategory: string, productCategory: string, productId: number){
    this.router.navigate([`/product-detail/${productParentCategory}/${productCategory}/product`, {productId: productId}]);
  }

  productAddToCart(productDto: ProductDTO<any,any>){
    this.cartService.addToCart(productDto.productResponse, this.user!);
  }

}
