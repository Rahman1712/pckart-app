import { Injectable } from '@angular/core';
import { Order } from '../_model-dto/order/order';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ProductService } from './product.service';
import { ImageProcessingServiceService } from './image-processing-service.service';
import { Observable, map, of } from 'rxjs';
import { OrderService } from './order.service';

@Injectable({
  providedIn: 'root'
})
export class OrderResolverService implements Resolve<Order>{

  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessingServiceService,
    private orderService: OrderService,
  ) { }

  resolve(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot): 
    Observable<Order>
    {
      /// write logic here  rahmanananan
    
   return of(new Order());
  }
}
