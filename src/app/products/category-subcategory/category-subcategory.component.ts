import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDTO } from 'src/app/_model-dto/product/product-dto';
import { ImageProcessingServiceService } from 'src/app/_services/image-processing-service.service';
import { ProductService } from 'src/app/_services/product.service';
import { map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from 'src/app/_services/cart.service';
import { WishService } from 'src/app/_services/wish.service';
import { User } from 'src/app/_model-dto/user/user';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-category-subcategory',
  templateUrl: './category-subcategory.component.html',
  styleUrls: ['./category-subcategory.component.css']
})
export class CategorySubcategoryComponent implements OnInit{

  constructor(private productService: ProductService,
    private imageProcessingService: ImageProcessingServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private auth_service: AuthService,
    private cartService: CartService,
    private wishService: WishService,
  ){}

  parentCategoryName: string ;
  categoryName: string ;
  user : User | undefined = undefined;

  public productsListImgs: ProductDTO<any,any>[] | undefined;

  minLimit: number = 0;
  maxLimit: number = 0;
  stepValue: number = 1000;
  
  minPrice: number = 0;
  maxPrice: number = 0;
  colors = new Set<string>();
  brands = new Set<string>(); 
  selectedColors: string[] = [];
  selectedBrands: string[] = [];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.parentCategoryName = params['parent_category'];
      this.categoryName = params['sub_category'];
      
      this.getAllProductsByCategoryName(this.categoryName);
    });

    if(this.auth_service.loggedIn()){
      this.auth_service.getUserByUsername(this.auth_service.getUsername()!)
      .subscribe({
        next:(userRes: User) => {
          this.user = userRes;
        },
        error: (error: HttpErrorResponse) =>{
          console.log(error);
          alert(error.message);
        }
      });
    }
  }

  public getAllProductsByCategoryName(categoryName: string): void {
    this.productService.getProductsByCategoryName(categoryName)
    .pipe(
      map((x: ProductDTO<any,any>[] , i) => 
        x.map((product: ProductDTO<any,any>) => {
          const price = Math.floor(product.productResponse.productPrice);
          if(price < this.minPrice) this.minPrice = price;
          if(price >= this.maxPrice) this.maxPrice = price;
          this.minLimit = this.minPrice;
          this.maxLimit = this.maxPrice;
          this.stepValue = Math.floor(this.maxPrice/10);
          this.colors.add(product.productResponse.productColor);
          this.brands.add(product.productResponse.brandName);
          return this.imageProcessingService.createMainImageToProdDto(product)
        })
      )
    )
    .subscribe({
      next: (next: ProductDTO<any,any>[]) =>{
        console.log(next)
        this.productsListImgs = next;
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message)
      }
    });
  }

  viewProductDetails(productParentCategory: string, productCategory: string, productId: number){
    this.router.navigate([`/product-detail/${productParentCategory}/${productCategory}/product`, {productId: productId}]);
  }

  productAddToCart(productDto: ProductDTO<any,any>){
    this.cartService.addToCart(productDto.productResponse, this.user!);
  }

  productAddToWish(productDto: ProductDTO<any,any>){
    this.wishService.addToWish(productDto.productResponse, this.user!);
  }

  isInWishList(productId: number): boolean{
    return this.wishService.isInWishList(productId);
  }

  filterProducts(): void {
    // Replace this with your actual filter options or leave them empty to get all products
    const filterOptions = {
      brandNames: this.selectedBrands,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      colors: this.selectedColors
    };

    this.productService.getProductsByCategoryNameAndFilter(this.categoryName, filterOptions)
    .pipe(
      map((x: ProductDTO<any,any>[] , i) => 
        x.map((product: ProductDTO<any,any>) => 
          this.imageProcessingService.createMainImageToProdDto(product)
        )
      )
    )
    .subscribe({
      next: (next: ProductDTO<any,any>[]) =>{
        console.log(next)
        this.productsListImgs = next;
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message)
      }
    });
  }

  addOrRemoveColor(color: any): void {
    const index = this.selectedColors.indexOf(color);

    if (index !== -1) {
      // Color already selected, remove it from the selection
      this.selectedColors.splice(index, 1);
    } else {
      // Color not selected, add it to the selection
      this.selectedColors.push(color);
    }
    this.filterProducts();
  }

  addOrRemoveBrand(brand: any): void {
    const index = this.selectedBrands.indexOf(brand);

    if (index !== -1) {
      // brand already selected, remove it from the selection
      this.selectedBrands.splice(index, 1);
    } else {
      // brand not selected, add it to the selection
      this.selectedBrands.push(brand);
    }
    this.filterProducts();
  }

  priceFilter(){
    this.filterProducts();
  }

  
}
