import { HttpErrorResponse } from '@angular/common/http';
import { Component,OnInit,ElementRef,AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductDTO } from 'src/app/_model-dto/product/product-dto';
import { User } from 'src/app/_model-dto/user/user';
import { AuthService } from 'src/app/_services/auth.service';
import { CartService } from 'src/app/_services/cart.service';
import * as $ from 'jquery';

// declare var $: any;

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit,AfterViewInit{

  constructor(
    private activatedRoute: ActivatedRoute,
    private auth_service: AuthService,
    private cartService: CartService,
    private elementRef: ElementRef,
    ){

  }
  
  productId: number;
  productDto : ProductDTO<any,any>;
  selectedProductIndex = 0;
  parentCategoryName: string ;
  categoryName: string ;

  myThumbnail : any
  myFullResImage : any 
  // myThumbnail : any ;
  // myFullResImage : '/assets/img/ALIENWARE.jpg'

  user : User | undefined = undefined;

  ngAfterViewInit() {
    const image = $('#zoom-image');
    $(this.elementRef.nativeElement).ready(function () {
      // $('#zoom-image').zoom();
      console.log("DDDDD")
      console.log(image)
    });

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.parentCategoryName = params['parent_category'];
      this.categoryName = params['sub_category'];
    })
    this.productDto = this.activatedRoute.snapshot.data['productDto'];

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
    
    // url: SafeUrl
    this.myThumbnail = this.productDto.productResponse.mainImage.url
    this.myFullResImage = this.productDto.productResponse.mainImage.url
    this.setupImageZoom();
  }

  changeIndex(index: number){
    this.selectedProductIndex = index;

    this.myThumbnail = this.productDto.productResponse.allImages[index].url
    this.myFullResImage = this.productDto.productResponse.allImages[index].url
  }

  productAddToCart(productDto: ProductDTO<any,any>){
    this.cartService.addToCart(productDto.productResponse, this.user!);
  }

  setupImageZoom() {
    // You can customize the zoom factor as per your requirement.
    // const zoomFactor = 1.5;

    // // Get the image element by its ID using jQuery.
    // const image = $('#zoomImage');

    // $(document).ready(function(){
    //   image.zoom({url: 'photo-big.jpg'});
    // });
  }
  
}
