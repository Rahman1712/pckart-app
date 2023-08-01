import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { ProductService } from './product.service';
import { ImageProcessingServiceService } from './image-processing-service.service';
import { ProductDTO } from '../_model-dto/product/product-dto';


@Injectable({
  providedIn: 'root'
})
export class ProductResolverService implements Resolve<ProductDTO<any,any>>{

  constructor(private productService:ProductService, private imageProcessingServie:ImageProcessingServiceService) { }

  resolve(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot): 
    Observable<ProductDTO<any, any>> 
    {
    
      const productId = Number(route.paramMap.get("productId"));
      if(productId){
        return this.productService.getProductByIdWithImages(productId)
          .pipe(
            map(p => this.imageProcessingServie.createAllImagesToProdDto(p))
          )
      }else{
        return of(this.getProductDetails());
      }
  }

  getProductDetails():any{
    return {
      productResponse: undefined,
      imgdata: undefined,
      imgModel: undefined
    };
  }
}
