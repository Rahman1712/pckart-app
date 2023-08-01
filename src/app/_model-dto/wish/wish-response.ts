import { ProductResponse } from "../product/product-response";

export class WishResponse{
  wishId: number;
  userId: number;
  productId: number;

  productResponse: ProductResponse;
}