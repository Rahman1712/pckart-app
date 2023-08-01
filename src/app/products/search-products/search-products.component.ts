import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDTO } from 'src/app/_model-dto/product/product-dto';
import { User } from 'src/app/_model-dto/user/user';
import { AuthService } from 'src/app/_services/auth.service';
import { CartService } from 'src/app/_services/cart.service';
import { ImageProcessingServiceService } from 'src/app/_services/image-processing-service.service';
import { ProductService } from 'src/app/_services/product.service';
import { WishService } from 'src/app/_services/wish.service';
import { map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductPagination } from 'src/app/_model-dto/product/product-pagination';
import { ProductResponse } from 'src/app/_model-dto/product/product-response';

@Component({
  selector: 'app-search-products',
  templateUrl: './search-products.component.html',
  styleUrls: ['./search-products.component.css']
})
export class SearchProductsComponent implements OnInit{

  constructor(private productService: ProductService,
    private imageProcessingService: ImageProcessingServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private auth_service: AuthService,
    private cartService: CartService,
    private wishService: WishService,
  ){}

  searchKeyword: string = '';
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

  public productsPagination: ProductPagination<ProductDTO<any,any>>;
  
  public productsListImgs: ProductResponse[] = [];

  public pageNum: number = 1;
  public limit: number = 10;
  public sortField: string = 'name'; // id, name, brand, price, quantity, discount, category, color, description , specs , added_at, active
  public sortDir: string = 'asc'; // 'asc' ,desc'
  public totalItems: number;


  public totalListNums : number = 0;


  ngOnInit() {
    // this.route.queryParams.subscribe(params => {
      //   this.searchKeyword = params['searchKeyword'];
      // });
      this.route.queryParamMap.subscribe(params => {
        this.searchKeyword = params.get('searchKeyword')!;
        this.minLimit = 0;
        this.maxLimit = 0;
        this.selectedColors = [];
        this.selectedBrands = [];
        this.productsListImgs = [];
      
      this.getProductsWithPagination(this.pageNum,this.limit,this.sortField,this.sortDir);
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

   public getProductsWithPagination(pageNum:number,limit: number, sortField: string, sortDir: string){
    this.productService.getProductsWithImagesAndPagination(pageNum,limit,sortField,sortDir, this.searchKeyword)
    .pipe(
      map((prodPage:ProductPagination<ProductDTO<any,any>>) =>
        this.imageProcessingService.createImagesToPagination(prodPage)
      )
    )
    .subscribe({
      next: (next: ProductPagination<ProductDTO<any, any>>) =>{
        console.log(next);
        this.productsPagination = next;

        this.productsPagination.listProducts.forEach(product=>{
          const price = Math.floor(product.productResponse.productPrice);
          if(price < this.minPrice) this.minPrice = price;
          if(price >= this.maxPrice) this.maxPrice = price;
          this.minLimit = this.minPrice;
          this.maxLimit = this.maxPrice;
          this.stepValue = Math.floor(this.maxPrice/10);
          this.colors.add(product.productResponse.productColor);
          this.brands.add(product.productResponse.brandName);
        });
       
        //this.productsListImgs = [...this.productsListImgs, ...this.productsPagination.listProducts.map(x => x.productResponse)];
        this.productsListImgs = this.productsListImgs.concat(this.productsPagination.listProducts.map(x => x.productResponse));


        this.pageNum = this.productsPagination.pageNum;
        this.sortField = this.productsPagination.sortField;
        this.sortDir = this.productsPagination.sortDir;
        this.totalItems = this.productsPagination.totalItems;
        
        this.totalListNums = this.productsListImgs.length;
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    });
  }

  showMore(){
    this.getProductsWithPagination(this.pageNum+1,this.limit, this.sortField,this.sortDir);
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
  }

  viewProductDetails(productParentCategory: string, productCategory: string, productId: number){
    this.router.navigate([`/product-detail/${productParentCategory}/${productCategory}/product`, {productId: productId}]);
  }

  productAddToCart(product: ProductResponse){
    this.cartService.addToCart(product, this.user!);
  }

  productAddToWish(product: ProductResponse){
    this.wishService.addToWish(product, this.user!);
  }

  isInWishList(productId: number): boolean{
    return this.wishService.isInWishList(productId);
  }
  
}


/*
public reverseSortDir: string;
public totalPages: number;
public startCount: number;
public endCount: number;

*/
/*
  this.limit = this.productsPagination.limit;
  this.productsListImgs = this.productsPagination.listProducts;
  this.pageNum = this.productsPagination.pageNum;
  this.limit = this.productsPagination.limit;
  this.sortField = this.productsPagination.sortField;
  this.sortDir = this.productsPagination.sortDir;
  this.totalItems = this.productsPagination.totalItems;
  this.reverseSortDir = this.productsPagination.reverseSortDir;
  this.totalPages = this.productsPagination.totalPages;
  this.startCount = this.productsPagination.startCount;
  this.endCount = this.productsPagination.endCount;

*/