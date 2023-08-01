import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { Category } from '../_model-dto/category/category';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';
import {  Router } from '@angular/router';
import { map } from 'rxjs';
import { ImageProcessingServiceService } from '../_services/image-processing-service.service';
import { User } from '../_model-dto/user/user';
import { WishService } from '../_services/wish.service';
import { ProductDTO } from '../_model-dto/product/product-dto';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit{
  constructor(private productService: ProductService,
     public authService: AuthService,
     private router: Router ,
     private wishService: WishService,
     private imageProcessingService: ImageProcessingServiceService,
     ){}
 
  @ViewChildren('headCategory', {read: ElementRef}) headCategories!: QueryList<ElementRef>;
  selectedLinkIndex : number = -1;
  ngAfterViewInit(): void {
    console.log(this.headCategories)
    this.headCategories.forEach((link: ElementRef, index: number)=>{
      link.nativeElement.addEventListener('click',()=>this.selectLink(index));
    });
  }

  cartLength = 0;
  wishLength = 0;

  user : User = new User();

  searchKeyword:string = '';
  limit:number =  5;
  public categoriesList: Category[] | undefined;
  public productsSearchList: ProductDTO<any,any>[] = [];

  
  ngOnInit(): void {
    this.getAllCategories();
    this.getUserData();
    // this.getCartItemLength();
    this.getWishItemLength();
  }
/* ===========================USER===============================*/
  getUserData(){
    if(this.authService.loggedIn()){
      this.authService.getUserByUsername(this.authService.getUsername()!)
      .pipe(
        map((user: User) => 
          this.imageProcessingService.createUserImage(user)
        )
      )
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
/* ===========================GET CATEGORIES===============================*/
  public getAllCategories(): void{
    this.productService.getAllParentCategories()
    .subscribe({
      next: (next : Category[]) =>{
        console.log(next)
        this.categoriesList = next;
        this.categoriesList.forEach(category => this.getAllSubcategorieByParent(category));
      },
      error : (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }
/* ===========================GET ALL SUBCATEGORIES===============================*/
  public getAllSubcategorieByParent(parentCategory: Category): any {
    this.productService.getAllSubcategoriesIdAndNameNoImage(parentCategory.name)
    .subscribe({
        next: (subCategoriesList: Category[]) => {
          console.log(subCategoriesList);
          parentCategory.subcategories = subCategoriesList;
        },
        error: (error: HttpErrorResponse) => {
          // alert(error.message);
          console.log(error);
        }
      });
  }
/* ===========================GET SEARCH PRODUCTS===============================*/
  searchOperation(){
    if(this.searchKeyword.trim() != ''){
      this.getAllProductsBySearchKeywordAndLimit();
    }else{
      this.productsSearchList = [];
    }
  }

  searchResultsPage(){
    alert('ddd')
  }

  public getAllProductsBySearchKeywordAndLimit(): void {
    this.productService.getAllProductsByKeywordAndLimit(this.searchKeyword, this.limit)
    .pipe(
      map((x: ProductDTO<any,any>[] , i) => 
        x.map((product: ProductDTO<any,any>) => {
          return this.imageProcessingService.createMainImageToProdDto(product)
        })
      )
    )
    .subscribe({
      next: (searchList: ProductDTO<any,any>[]) =>{
        console.log(searchList)
        this.productsSearchList = searchList;
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message)
      }
    });
  }
/* =====================LOGOUT=====================================*/
  logoutUser() {
    this.authService.clear();
    this.refreshPath();
    this.clearCartAndWish();
  }
/* ===========================REFRESH PATH===============================*/
  refreshPath(){
    const currentPath = this.router.url;
    console.log('Current path: ' + currentPath);
    // console.log(this.snap.url);
    
    this.router.navigate(['/']);
    
  }
/* ===========================CLEAR CART AND WISH===============================*/
  clearCartAndWish(){
    // this.cartService.clearCart();
    this.cartLength = 0;

    this.wishService.clearWish();
    this.wishLength = 0;
  }
/* ===========================SELECTED LINK===============================*/
  selectLink(index: number){
    this.selectedLinkIndex = index;
  }
  
/* ===========================WISH LENGTH===============================*/
  getWishItemLength(){
    this.wishService.getWishItemsLength()
    .subscribe( len => this.wishLength = len)
  }
/* ==========================================================*/
}
