import { ProductResponse } from "../product/product-response";

export class CartResponse{
  cartId: number;
  userId: number;
  productId: number;
  quantity: number;

  productResponse: ProductResponse;
}