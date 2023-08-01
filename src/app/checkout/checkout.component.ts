import { Component,OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OrderService } from '../_services/order.service';
import { CartService } from '../_services/cart.service';
import { ProductService } from '../_services/product.service';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { User } from '../_model-dto/user/user';
import { ProductDTO } from '../_model-dto/product/product-dto';
import { CartResponse } from '../_model-dto/cart/cart-response';
import { map } from 'rxjs';
import { ProductDetails } from '../_model-dto/product/product-details';
import { HttpErrorResponse } from '@angular/common/http';
import { CouponService } from '../_services/coupon.service';
import { error } from 'jquery';
import { Address } from '../_model-dto/user/address';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddressAddEditComponent } from '../profile/address-add-edit/address-add-edit.component';
import { AddressService } from '../_services/address.service';
import { PaymentMethod } from '../_model-dto/order/payment-method';
import { TransactionDetails } from '../_model-dto/order/transaction-details';
import { OrderRequest } from '../_model-dto/order/order-request';
import { OrderAddress } from '../_model-dto/order/order-address';
import { Payment } from '../_model-dto/order/payment';
import { OrderProduct } from '../_model-dto/order/order-product';
import { Order } from '../_model-dto/order/order';
import { AlertBoxesComponent, AlertType } from '../_utils/alert-boxes/alert-boxes.component';
// import * as Razorpay from 'razorpay';

declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{  

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private auth_service: AuthService,
    private router: Router,
    private order_service:OrderService,
    private coupon_service: CouponService,
    public dialog: MatDialog,
    public address_service: AddressService,
  ) { }

  user: User = new User();
  addressList : Address[] = [];
  user_coupon_id : number = 0;
  coupon: any = null;
  shipping: number = 0;
  // grandTotal: number = 0;
  cartResponseItems : CartResponse[] = [];

  isValidCoupon: boolean = false;
  errorMsgCoupon:string = '';
  buttonEnable: boolean = false;
  couponDiscount: number = 0;
  
  selectedAddress: Address ;
  contact: string = '';
  alternative_contact: string = '';
  
  paymentMethod :PaymentMethod ;
  transactionDetails: TransactionDetails = new TransactionDetails();
  
  showProgressRound: boolean = false;
  dialogRef: MatDialogRef<AddressAddEditComponent> | null;
  dialogAlertRef: MatDialogRef<AlertBoxesComponent> | null;

  ngOnInit(): void {
    this.getUserData();
    this.cartResponseItems = [];
    this.getallCarts();
  }

  getUserData(){
    this.auth_service.getUserByUsername(this.auth_service.getUsername()!)
    .subscribe(user => {
      this.user = user;
      this.addressList = user.addresses;
      this.addressList.find(
        add => {
          if(add.selected) this.selectedAddress = add;
      }); 
      this.addressList.sort((a,b) => a.id-b.id);
      this.contact = this.selectedAddress.contact;
      this.alternative_contact = this.selectedAddress.alternative_contact;
    });
  }

  getallCarts(){
    this.auth_service.getUserByUsername(this.auth_service.getUsername()!)
    .subscribe({
      next: (user: User) =>{
        this.cartService.getAllCartsByUserId(user.id)
        .pipe(
          map((carts: CartResponse[]) => {
            carts.forEach((cart) =>{
              this.getAllProductsByCartItem(cart);
            })
            return carts;
          })
        )
        .subscribe({
          next: (cartList: CartResponse[]) =>{
            console.log(cartList);
            if(cartList != null){
              this.cartResponseItems = cartList;
            }
          }
        });
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        alert(error.message);
      }
    });
  }
  async getAllProductsByCartItem(cartResponse: CartResponse) {

    this.productService.getProductDetailsMainImageById(cartResponse.productId)
      .subscribe({
        next: (next: ProductDTO<any,any>) =>{
          this.productService.getParentCategoryNameByCategory(next.productResponse.categoryName)
            .subscribe( parentName => {
              cartResponse.productResponse = next.productResponse;
              cartResponse.productResponse.parentCategoryName = parentName;
          })
        },
        error: (error: HttpErrorResponse) =>{
          alert(error.message)
          console.log(error)
        }
      });
  }

  applyCoupon(couponCode : string){
    this.coupon_service.checkAndCreateByCode(couponCode,this.user.id)
    .subscribe({
      next: (result: any) =>{
        console.log(result)
        if(result.valid ){
          if(result.is_used){
            this.isValidCoupon = false;
            this.errorMsgCoupon = result.message;
            this.user_coupon_id = 0;
          }else{
            this.isValidCoupon = true;
            this.couponDiscount = result.coupon.discount;
            this.user_coupon_id = result.user_coupon_id;
            this.coupon = result.coupon;
          }
        }
        else{
          this.isValidCoupon = false;
          this.errorMsgCoupon = result.message;
          this.user_coupon_id = 0;
        }
      },
      error:(error:HttpErrorResponse) =>{
        console.log(error);
        alert(error.message)
      }
    })
  }

  removeCoupon(couponCode : any){ //couponCode ennathu input[text] aanu
    this.isValidCoupon = false;
    this.couponDiscount = 0;
    this.user_coupon_id = 0;
    couponCode.value = '';
    this.coupon = null;
  }

  validChange(coupon_code: string){
    this.buttonEnable = coupon_code.length >= 3 ? true: false;
    this.errorMsgCoupon = '';
    this.couponDiscount = 0;
    this.isValidCoupon = false;
    this.user_coupon_id = 0;
  }

  calculateSubtotal(): number {
    let subtotal = 0;

    for (const cartItem of this.cartResponseItems) {
      subtotal += cartItem.quantity * cartItem.productResponse.productPrice;
    }
    
    this.shipping = subtotal > 1000 ? 0 : 50; 

    return subtotal;
  }

  placeOrder(orderForm: NgForm){
    if(this.paymentMethod == PaymentMethod.CASH_ON_DELIVERY){
      // console.log("COD")
      this.processResponse(null);
    }else{
      // console.log('ONLINE')
      this.createTransactionAndPlaceOrder();
    }
  }
  
  createTransactionAndPlaceOrder(){
    let subtotal = this.calculateSubtotal();
    if(this.couponDiscount > 0){
      subtotal = subtotal - (subtotal * this.couponDiscount / 100);
    }
    if(this.shipping > 0){
      subtotal = subtotal + this.shipping;
    }

    this.order_service.createTransaction(subtotal)
    .subscribe({
      next: (response: TransactionDetails) => {
        console.log(response);
        this.transactionDetails = response;
        /*{orderId: 'order_MHvzT6digVt8lg', currency: 'INR', amount: 5180000, key: 'rzp_test_K9qFfxNeV2pv2R'}*/
        this.openTransactionModal(response);
      },
      error: (error) =>{
        alert(error.message);
        console.log(error);
      }
    });
  }


  //=================razorpay model============
  openTransactionModal(response: any){
    var options = {
      order_id: response.orderId,
      key: response.key,
      amount: response.amount,
      currency: response.currency,
      name: this.user.fullname,
      description: 'Payment of PcKart Shopping',
      image: 'https://cdn.pixabay.com/photo/2016/09/30/17/29/shopping-1705800_1280.png',
      handler: (response: any) =>{
        /* {razorpay_payment_id: 'pay_MHvxr7K0SeiX8s', razorpay_order_id: 'order_MHvxRVeUTCEVAU', razorpay_signature: 'a6ac2256dab7aac7a740488adbcb79527f9e2c8f9608c37ae98289a3751d8802'} */
        console.log(response);
        if(response!=null && response.razorpay_payment_id != null){
          this.processResponse(response);
        }else{
          alert("Payment Failed..");
        }
      },
      prefill : {
        name: 'PcKart',
        email: 'pckart@gmail.com',
        contact: '9090909090'
      },
      notes: {
        address: 'Online Shopping'
      },
      theme: {
        color: '#012970'
      }
    };

    this.showProgressRound = true; // Show the progress round when "Place Order" is clicked

    var razorPayObject = new Razorpay(options);
    razorPayObject.open();
    // Simulate the loading process before opening the Razorpay popup
    setTimeout(() => {
      // Hide the progress round
      this.showProgressRound = false;

      // Replace this with your actual Razorpay integration code
    }, 2000); // Simulating a 2-second delay before opening the Razorpay popup
 
  }

  processResponse(resp: any){
    const orderRequest: OrderRequest = new OrderRequest();
    
    orderRequest.userId = this.user.id;
    const orderAddress = new OrderAddress(
      this.selectedAddress.fullname,
      this.selectedAddress.houseno,
      this.selectedAddress.place,
      this.selectedAddress.city,
      this.selectedAddress.post,
      this.selectedAddress.pincode,
      this.selectedAddress.state,
      this.selectedAddress.country,
      this.selectedAddress.contact,
      this.selectedAddress.alternative_contact
    );
    orderRequest.orderAddress  = orderAddress;

    orderRequest.grandTotalPrice = this.calculateSubtotal() ;
    orderRequest.userCouponId = this.user_coupon_id;
    if(this.user_coupon_id != 0){ orderRequest.couponDiscount = this.coupon.discount;}
    orderRequest.shippingCharge = this.shipping ;
    orderRequest.totalPricePaid = ((this.calculateSubtotal()+this.shipping) - this.calculateSubtotal()*this.couponDiscount/100);

    const products :OrderProduct[] = [];
    this.cartResponseItems.forEach(cr => {
      const prod = new OrderProduct(cr.productId, cr.productResponse.productName, cr.productResponse.productPrice, cr.quantity, cr.productResponse.brandName, cr.productResponse.categoryName, cr.productResponse.productColor);
      products.push(prod);
    });
    orderRequest.products = products;

    const payment:Payment = new Payment();
    if(this.paymentMethod == PaymentMethod.ONLINE){
      payment.razorpay_payment_id = resp.razorpay_payment_id;
      payment.razorpay_order_id = resp.razorpay_order_id;
      payment.razorpay_signature = resp.razorpay_signature;
      payment.orderId = this.transactionDetails.orderId;
      payment.amount = this.transactionDetails.amount;
    }
    orderRequest.payment = payment;
    orderRequest.paymentMethod = this.paymentMethod ;
    console.log(this.paymentMethod)
    console.log(orderRequest.paymentMethod)

    console.log(orderRequest);
    this.order_service.saveOrder(orderRequest)
    .subscribe({
      next:(order: Order) => {
        console.log(order);
        
        this.dialogAlertRef = this.dialog.open(AlertBoxesComponent, {
          disableClose: true
        });
        this.dialogAlertRef.componentInstance.alertType = AlertType.INFO;
        this.dialogAlertRef.componentInstance.info_title = "order placed";
        this.dialogAlertRef.componentInstance.info_message = "Order placed successfully";
        this.dialogAlertRef.componentInstance.info_color = "primary";
  
        this.dialogAlertRef.afterClosed().subscribe(result => {
          this.dialogAlertRef = null;
          this.router.navigate(['/orders']);
        });
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error);
        // alert(error.message);
        this.dialogAlertRef = this.dialog.open(AlertBoxesComponent, {
          disableClose: true
        });
        this.dialogAlertRef.componentInstance.alertType = AlertType.INFO;
        this.dialogAlertRef.componentInstance.info_title = "Error";
        this.dialogAlertRef.componentInstance.info_message = "Error in Order placing";
        this.dialogAlertRef.componentInstance.info_color = "warn";
  
        this.dialogAlertRef.afterClosed().subscribe(result => {
          this.dialogAlertRef = null;
        });
      }
    });
  }
  
  // =====================Add and Update address============
  updateAddress(address: Address){
    this.dialogRef = this.dialog.open(AddressAddEditComponent, {
      disableClose: true,
      width: "80%",
      // height: "90vh",
      // height: '400px',
    });  
    this.dialogRef.componentInstance.address = address;
    this.dialogRef.componentInstance.isNew = false;
    this.dialogRef.afterClosed().subscribe(result => {
      if(result != 'close'){
        console.log(result)
        this.user.addresses.forEach(add =>{
          if(add.id == result.id) add.selected = true;
          else add.selected = false;
        });
        this.address_service.saveAddresses(this.user.username, this.user.addresses)
        .subscribe({
          next: (userResult: User) =>{
            console.log(userResult);
            // this.user.addresses =  userResult.addresses;
            // this.addressList = userResult.addresses;
            this.getUserData();
          },
          error: (error: HttpErrorResponse) =>{
            alert(error.message)
            console.log(error);
          }
        });
      }else{
        console.log('dialog closed : back')
      }
      this.dialogRef = null;
    });
  }
  addAddress(){
    let newAddress: Address = new Address();
    this.dialogRef = this.dialog.open(AddressAddEditComponent, {
      disableClose: true,
      width: "80%",
      height: "80%",
      // height: "90vh",
      // height: '400px',
    });
    this.dialogRef.componentInstance.isNew = true;
    this.dialogRef.componentInstance.address = newAddress;
    this.dialogRef.afterClosed().subscribe(result => {
      if(result != 'close'){
        console.log(result)
        result.selected = true;
        this.user.addresses.forEach(add =>{
          add.selected = false;
        });
        this.user.addresses.push(result);
        this.address_service.saveAddresses(this.user.username, this.user.addresses)
        .subscribe({
          next: (userResult: User) =>{
            console.log(userResult);
            // this.user.addresses =  userResult.addresses;
            // this.addressList = userResult.addresses;
            this.getUserData();
          },
          error: (error: HttpErrorResponse) =>{
            alert(error.message)
            console.log(error);
          }
        });
      }else{
        console.log('dialog closed : back')
      }
      this.dialogRef = null;
    });
  }
  setDefault(id: number){
    this.address_service.updateAddressSelected(id,this.user.id)
    .subscribe({
      next: (res: string) => {
        console.log(res);
        this.getUserData();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message)
        console.log(error);
      }
    });
  }
  updateContactDetails(contactForm:NgForm,address: Address){
    const contact =  contactForm.controls['contact'].value;
    let alternative_contact =  contactForm.controls['alternative_contact'].value;
    const contactRegex = /^\d{10}$/ ;
    if(!contactRegex.test(contact)){
      return;
    }
    if(alternative_contact != "" && alternative_contact != null && !contactRegex.test(alternative_contact)){
      return;
    }
    if(alternative_contact == null || alternative_contact == undefined) {
      alternative_contact = "";
    }
     
    this.address_service.updateAddressContacts(this.selectedAddress.id,contact,alternative_contact)
    .subscribe({
      next: (res: string) => {
        console.log(res);
        this.getUserData();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message)
        console.log(error);
      }
    });
  }

  // --------------------------
  paymentMethodSelect(event : any){
    if(event.target.value == 'ONLINE'){
      this.paymentMethod = PaymentMethod.ONLINE;
    }
    else{
      this.paymentMethod = PaymentMethod.CASH_ON_DELIVERY;
    }
  }

  getPaymentText():string{
    return this.paymentMethod.toString();
  }

  //-----------------------------


}

/*
checkout(){
  let products: ProductDetails[] = [];
  this.cartResponseItems.forEach(cartProd =>{
    products.push(new ProductDetails(cartProd.productId,cartProd.quantity));
  });
  this.productService.grandTotalofProducts(products)
  .subscribe({
    next: (response) => {
      console.log(response);
    },
    error: (error) => {
      console.log(error);
      alert(error);
    }
  });
}
*/


/*

if(alternative_contact != "" && alternative_contact != null && !contactRegex.test(alternative_contact)){
      return;
    }
    if(alternative_contact == "" || alternative_contact == null || alternative_contact == undefined) {
      console.log(contact);
      this.address_service.updateAddressContactOnly(this.selectedAddress.id,contact)
      .subscribe({
        next: (res: string) => {
          console.log(res);
          this.getUserData();
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message)
          console.log(error);
        }
      });
    }else{
      this.address_service.updateAddressContacts(this.selectedAddress.id,contact,alternative_contact)
    .subscribe({
      next: (res: string) => {
        console.log(res);
        this.getUserData();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message)
        console.log(error);
      }
    });
    }

*/