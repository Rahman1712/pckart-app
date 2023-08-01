import { HttpErrorResponse } from '@angular/common/http';
import { Component,OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/_model-dto/category/category';
import { ProductService } from 'src/app/_services/product.service';
import { map } from 'rxjs';
import { ImageProcessingServiceService } from 'src/app/_services/image-processing-service.service';
import { ProductDTO } from 'src/app/_model-dto/product/product-dto';
import { CartService } from 'src/app/_services/cart.service';
import { User } from 'src/app/_model-dto/user/user';
import { AuthService } from 'src/app/_services/auth.service';
import { WishService } from 'src/app/_services/wish.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit{

  constructor(private productService: ProductService,
    private imageProcessingService: ImageProcessingServiceService,
    private route: ActivatedRoute,
    private router: Router,
    // private user_service: UserserviceService,
    private auth_service: AuthService,
    private cartService: CartService,
    private wishService: WishService,
  ){}

  public productsListImgs: ProductDTO<any,any>[] | undefined;
  subCategoriesList: Category[];
  countMap = new Map();

  parentCategoryName: string ;
  categoriesList: Category[];
  // noOfProductsByCategoryArray: number[] ;
  user : User | undefined = undefined;

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
      this.countMap = new Map();

      this.parentCategoryName = params['parent_category'];
      
      this.getAllCategoriesByParentName(this.parentCategoryName);
      this.getAllProductsByParentCategoryName(this.parentCategoryName);
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

  // Initialize selectedColors and selectedBrands as empty arrays
  this.selectedColors = [];
  this.selectedBrands = [];
  }

  public categoryCount(categoryName: string ): any{
    this.productService.countProductsByCategoryName(categoryName)
    .subscribe({
      next: (next: string) => {
        console.log(`Name : ${categoryName}    |   Count : ${next}`)
        this.countMap.set(categoryName,next);
        return next;
      },
      error: (error: HttpErrorResponse) => {
        alert(`COUNT ERROR : ${error.message}`);
        return null;
      }
    });
  }
  
  public getAllCategoriesByParentName(parentCategory: string): void {
    this.productService.getAllCategoriesByParentName(parentCategory)
      .pipe(
        map((categories: Category[], i) =>
          categories.map((category: Category) =>
            this.imageProcessingService.createCategoryImage(category)
          )
        )
      )
      .subscribe({
        next: (next: Category[]) => {
          this.subCategoriesList = next;
          console.log(this.subCategoriesList);

          this.subCategoriesList.forEach(subCat => {
            // console.log(subCat);
            const count = this.categoryCount(subCat.name);
            console.log('$$$$$ -> ',subCat.name)
            // this.subCategoriesCountList.push()
            // this.subCategoriesCountList[i] = count == undefined ? 0 : Number(count);
            // i++;
          })
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message);
        }
      });
  }

  public getAllProductsByParentCategoryName(parentCategory: string): void {
    this.productService.getProductsByParentCategoryName(parentCategory)
    .pipe(
      map((x: ProductDTO<any,any>[] , i) => 
        x.map((product: ProductDTO<any,any>) =>{
          const price = Math.floor(product.productResponse.productPrice);
          if(price < this.minPrice) this.minPrice = price;
          if(price >= this.maxPrice) this.maxPrice = price;
          this.minLimit = this.minPrice;
          this.maxLimit = this.maxPrice;
          this.stepValue = Math.floor(this.maxPrice/10);
          this.colors.add(product.productResponse.productColor);
          this.brands.add(product.productResponse.brandName);
          return this.imageProcessingService.createMainImageToProdDto(product)
         } 
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

  filterProducts(): void {
    // Replace this with your actual filter options or leave them empty to get all products
    const filterOptions = {
      brandNames: this.selectedBrands,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      colors: this.selectedColors
    };

    this.productService.getProductsByParentCategoryNameAndFilter(this.parentCategoryName, filterOptions)
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


