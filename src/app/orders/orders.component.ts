import { Component,OnInit } from '@angular/core';
import { User } from '../_model-dto/user/user';
import { AuthService } from '../_services/auth.service';
import { ImageProcessingServiceService } from '../_services/image-processing-service.service';
import {map} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { mergeMap } from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http'
import { OrderService } from '../_services/order.service';
import { Order } from '../_model-dto/order/order';
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OrderViewComponent } from './order-view/order-view.component';
import { Router } from '@angular/router';
import { OrderStatus } from '../_model-dto/order/order-status';
import { error } from 'jquery';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertBoxesComponent, AlertType } from '../_utils/alert-boxes/alert-boxes.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit{

  constructor(
    private auth_service: AuthService, 
    private imageProcessingService: ImageProcessingServiceService,
    private order_service: OrderService,
    private router: Router,
    public dialog: MatDialog,
  ){}
  user: User = new User();
  ordersList: Order[] = [];
  dialogAlertRef: MatDialogRef<AlertBoxesComponent> | null;

  ngOnInit() {
    this.getUserDetailAndFetchOrders();
  }

  getUserDetailAndFetchOrders() {
    this.auth_service.getUserByUsername(this.auth_service.getUsername()!)
      .subscribe({
        next: (user: User) => {
          this.user = this.imageProcessingService.createUserImage(user); 
          this.fetchOrdersForUser(this.user);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          alert(error.message);
        }
      });
  }
  
  fetchOrdersForUser(user: User) {
    this.order_service.getAllOrdersByUserId(user.id)
      .subscribe({
        next: (orders: Order[]) => {
          this.ordersList = orders;
          console.log(this.ordersList);
          this.sortOrdersByDate();
          console.log(this.ordersList);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          alert(error.message);
        }
      });
  }

  sortOrdersByDate(): void {
    this.ordersList.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }

  orderStatusActive(order: Order, orderStatus: any): boolean{
    const result = order.trackStatus.find(t => t.order_status == orderStatus);
    return !!result;
  }

  orderReturnTimeCrossed(order: Order): boolean{
    const result = order.trackStatus.find(t => t.order_status == OrderStatus.DELIVERED);
    if(result){
      const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 * 24 * 60 * 60 * 1000 => 7 days
      const statusTimeMilliseconds = new Date(result.status_time).getTime();
      const currentTimeMilliseconds = new Date().getTime();
      const differenceInMilliseconds = currentTimeMilliseconds - statusTimeMilliseconds;
  
      return differenceInMilliseconds > oneWeekInMilliseconds;
    }else{
      return false;
    }
  }

  bgOrderSelect(orderStatus: any, badge: boolean): string{
    if(badge){
      switch(orderStatus){
        case OrderStatus.ORDERED : return 'bg-light text-success';
        case OrderStatus.SHIPPED : return 'bg-primary text-white';
        case OrderStatus.CANCELLED : return 'bg-danger text-white';
        case OrderStatus.PROCESSING : return 'bg-warning text-white';
        case OrderStatus.DELIVERED : return 'bg-success text-white';
        case OrderStatus.RETURNED : return 'bg-secondary text-white';
        default : return 'bg-success';
      }
    }else{
      switch(orderStatus){
        case OrderStatus.ORDERED : return 'bg-ordered';
        case OrderStatus.SHIPPED : return 'bg-shipped';
        case OrderStatus.CANCELLED : return 'bg-cancelled';
        case OrderStatus.PROCESSING : return 'bg-processing';
        case OrderStatus.DELIVERED : return 'bg-delivered';
        case OrderStatus.RETURNED : return 'bg-returned';
        default : return '';
      }
    }
  }

  viewOrderDetails(order: Order){
    // this.dialogRef = this.dialog.open(OrderViewComponent, {
    //   disableClose: true
    // });
    // this.dialogRef.componentInstance.order = order;
    this.router.navigate(['/orders/order-view'], { queryParams: { orderId: order.id}});
  }

  cancelOrder(order: Order){
    this.dialogAlertRef = this.dialog.open(AlertBoxesComponent, {
      disableClose: true
    });
    this.dialogAlertRef.componentInstance.alertType = AlertType.CONFIRMATION;
    this.dialogAlertRef.componentInstance.conform_title = "Confirm Cancel";
    this.dialogAlertRef.componentInstance.conform_message = "do you want cancel order?";
    this.dialogAlertRef.componentInstance.info_color = "primary";

    this.dialogAlertRef.afterClosed().subscribe(result => {
      if(result){
        this.order_service.updateOrderStatusById(order.id, OrderStatus.CANCELLED)
        .subscribe({
          next: (res : string) =>{
            console.log(res);
            this.dialogAlertRef = this.dialog.open(AlertBoxesComponent, {
              disableClose: true
            });
            this.dialogAlertRef.componentInstance.alertType = AlertType.INFO;
            this.dialogAlertRef.componentInstance.info_title = "Order Cancellation";
            this.dialogAlertRef.componentInstance.info_message = "Order cancelled successfully";
            this.dialogAlertRef.componentInstance.info_color = "primary";
      
            this.dialogAlertRef.afterClosed().subscribe(result => {
              this.dialogAlertRef = null;
              this.ngOnInit();
            });
          },
          error: (error: HttpErrorResponse) =>{
            console.log(error);
            this.dialogAlertRef = this.dialog.open(AlertBoxesComponent, {
              disableClose: true
            });
            this.dialogAlertRef.componentInstance.alertType = AlertType.INFO;
            this.dialogAlertRef.componentInstance.info_title = "Error";
            this.dialogAlertRef.componentInstance.info_message = "Error in cancel order updation";
            this.dialogAlertRef.componentInstance.info_color = "warn";
      
            this.dialogAlertRef.afterClosed().subscribe(result => {
              this.dialogAlertRef = null;
            });
          }
        });
      }else{
        this.dialogAlertRef = null;
      }
    });
  }

  returnOrder(order: Order){
    this.dialogAlertRef = this.dialog.open(AlertBoxesComponent, {
      disableClose: true
    });
    this.dialogAlertRef.componentInstance.alertType = AlertType.CONFIRMATION;
    this.dialogAlertRef.componentInstance.conform_title = "Confirm Return";
    this.dialogAlertRef.componentInstance.conform_message = "do you want return order?";
    this.dialogAlertRef.componentInstance.info_color = "primary";

    this.dialogAlertRef.afterClosed().subscribe(result => {
      if(result){
        this.order_service.updateOrderStatusById(order.id, OrderStatus.RETURNED)
        .subscribe({
          next: (res : string) =>{
            console.log(res);
            this.dialogAlertRef = this.dialog.open(AlertBoxesComponent, {
              disableClose: true
            });
            this.dialogAlertRef.componentInstance.alertType = AlertType.INFO;
            this.dialogAlertRef.componentInstance.info_title = "Order Return";
            this.dialogAlertRef.componentInstance.info_message = "Send message for return. The response will send soon.";
            this.dialogAlertRef.componentInstance.info_color = "primary";
      
            this.dialogAlertRef.afterClosed().subscribe(result => {
              this.dialogAlertRef = null;
              this.ngOnInit();
            });
          },
          error: (error: HttpErrorResponse) =>{
            console.log(error);
            this.dialogAlertRef = this.dialog.open(AlertBoxesComponent, {
              disableClose: true
            });
            this.dialogAlertRef.componentInstance.alertType = AlertType.INFO;
            this.dialogAlertRef.componentInstance.info_title = "Error";
            this.dialogAlertRef.componentInstance.info_message = "Error in order return";
            this.dialogAlertRef.componentInstance.info_color = "warn";
      
            this.dialogAlertRef.afterClosed().subscribe(result => {
              this.dialogAlertRef = null;
            });
          }
        });
      }else{
        this.dialogAlertRef = null;
      }
    });
  }
  
}



/*


  getUserDetailAndFetchOrders() {
    this.auth_service.getUserByUsername(this.auth_service.getUsername()!)
      .pipe(
        switchMap((user: User) => {
          this.user = user; // Assign the user object to the component property
          return this.order_service.getAllOrdersByUserId(user.id); // Fetch orders based on user ID
        })
      )
      .subscribe({
        next: (orders: Order[]) => {
          console.log(orders);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          alert(error.message);
        }
      });
}
  
  public getUserDetail(){
    this.auth_service.getUserByUsername(this.auth_service.getUsername()!)
    .pipe(
      map((user: User) => 
        this.imageProcessingService.createUserImage(user)
      )
    )
    .subscribe({
      next: (user: User) =>{
        this.user = user;
        return user;
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        alert(error.message)
      }
    });
  }

*/