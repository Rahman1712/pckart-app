import { OrderAddress } from "./order-address";
import { OrderProduct } from "./order-product";
import { Payment } from "./payment";
import { PaymentMethod } from "./payment-method";

export class OrderRequest{
  userId: number;
	orderAddress: OrderAddress;
  grandTotalPrice: number;
	userCouponId: number ;
	couponDiscount: number ;
	shippingCharge: number ;
	totalPricePaid: number;
	products :OrderProduct[];
	payment: Payment;
	paymentMethod: PaymentMethod;
}