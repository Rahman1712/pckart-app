import { FileHandle } from "../file-handle.model";

export class OrderProduct{
  id:number;
  productId:number;
  productName: string;
  productPrice: number;
  productQuantity: number;
  brand: string;
  category: string;
  color: string;

  mainImage: FileHandle;
  parentCategoryName: string;

  constructor(productId:number,productName: string,productPrice: number,productQuantity: number,brand: string,category: string,color: string){
    this.productId = productId;
    this.productName = productName;
    this.productPrice = productPrice;
    this.productQuantity = productQuantity;
    this.brand = brand;
    this.category = category;
    this.color = color;
  }
}