import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { TransactionDetails } from '../_model-dto/order/transaction-details';
import { OrderRequest } from '../_model-dto/order/order-request';
import { Order } from '../_model-dto/order/order';
import { OrderStatus } from '../_model-dto/order/order-status';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiOrderUrl = environment.apiOrderUrl;

  constructor(private http: HttpClient) { }

  public createTransaction(amount: number): Observable<TransactionDetails>{
    return this.http.get<TransactionDetails>(`${this.apiOrderUrl}/createTransaction/${amount}`);
  }

  public saveOrder(orderRequest: OrderRequest): Observable<Order>{
    return this.http.post<Order>(`${this.apiOrderUrl}/saveOrder`, orderRequest);
  }

  public getAllOrdersByUserId(userId: number):Observable<Order[]>{
    return this.http.get<Order[]>(`${this.apiOrderUrl}/get/orders/byUserId/${userId}`);
  }

  public getOrderByOrderId(orderId: string):Observable<Order>{
    return this.http.get<Order>(`${this.apiOrderUrl}/get/order/byOrderId/${orderId}`);
  }

  public updateOrderStatusById(orderId: string, order_status: OrderStatus):Observable<string>{
    const params = { order_status: order_status,};
    return this.http.put(`${this.apiOrderUrl}/update/order_status/byid/${orderId}`, null, {params: params, responseType: 'text'})
  }
}
