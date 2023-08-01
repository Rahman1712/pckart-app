import { Component, OnInit } from '@angular/core';
import { ProductDTO } from 'src/app/_model-dto/product/product-dto';
import { ImageProcessingServiceService } from 'src/app/_services/image-processing-service.service';
import { ProductService } from 'src/app/_services/product.service';
import {map} from 'rxjs';
import { OrderProduct } from 'src/app/_model-dto/order/order-product';
import { HttpErrorResponse } from '@angular/common/http';
import { Order } from 'src/app/_model-dto/order/order';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/_services/order.service';
import { OrderStatus } from 'src/app/_model-dto/order/order-status';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css']
})
export class OrderViewComponent implements OnInit{

  order: Order = new Order();
  public orderId: string ;

  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessingServiceService,
    private route: ActivatedRoute,
    private order_service: OrderService,
  ){}

  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
    });

    this.getOrderByOrderId(this.orderId);
    
  }

  getOrderByOrderId(orderId: string){
    this.order_service.getOrderByOrderId(orderId)
    .subscribe({
      next: (order: Order) =>{
        order.products.forEach((orderProduct) =>{       
          this.getAllProductsByCartItem(orderProduct);
        });
        this.order = order;
      },
      error: (error: HttpErrorResponse) =>{
        alert(error.message);
        console.log(error);
      }
    });
  }

  getAllProductsByCartItem(orderProduct: OrderProduct ) {
    this.productService.getProductDetailsMainImageById(orderProduct.productId)
      .pipe(
        map((product: ProductDTO<any,any>) => 
          this.imageProcessingService.createMainImageToProdDto(product)
        )
      )
      .subscribe({
        next: (prodDto: ProductDTO<any,any>) =>{
          this.productService.getParentCategoryNameByCategory(orderProduct.category)
            .subscribe( parentName => {
              orderProduct.mainImage = prodDto.productResponse.mainImage;
              orderProduct.parentCategoryName = parentName;
              console.log(orderProduct);
          });
        },
        error: (error: HttpErrorResponse) =>{
          alert(error.message);
          console.log(error);
        }
      });
  }

  orderStatusImage(orderStatus: OrderStatus):string{
    switch(orderStatus){
      case OrderStatus.ORDERED : return "assets/img/order_delivery.png"; 
      case OrderStatus.SHIPPED : return "assets/img/shipped_truck.png"; 
      case OrderStatus.CANCELLED : return "assets/img/order_cancel.png"; 
      case OrderStatus.PROCESSING : return "assets/img/delivery.png"; 
      case OrderStatus.DELIVERED : return "assets/img/delivered_truck.png"; 
      case OrderStatus.RETURNED : return "assets/img/order_return.png"; 
      default : return "assets/img/shipped_truck.png"; 
    }
  }
  orderStatusActive(orderStatus: any): boolean{
    const result = this.order.trackStatus.find(t => t.order_status == orderStatus);
    return !!result;
  }

}
