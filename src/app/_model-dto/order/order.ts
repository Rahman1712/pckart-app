import { OrderAddress } from "./order-address";
import { OrderProduct } from "./order-product";
import { OrderStatus } from "./order-status";
import { PaymentMethod } from "./payment-method";
import { PaymentStatus } from "./payment-status";
import { TrackStatus } from "./track-status";

export class Order{
  id: string;
  userId: number;
  orderAddress: OrderAddress;
  grandTotalPrice: number;
  totalPricePaid: number;
  shippingCharge: number;
  couponDiscount: number;
  userCoupon: any;
  products: OrderProduct[];
  trackStatus: TrackStatus[];
  trackingNo: string;
  orderDate: any;
  orderStatus: OrderStatus;
  paymentId: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
}