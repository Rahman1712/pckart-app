import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Category } from '../_model-dto/category/category';
import { Brand } from '../_model-dto/brand/brand';
import { FileHandle } from '../_model-dto/file-handle.model';
import { ProductDTO } from '../_model-dto/product/product-dto';
import { User } from '../_model-dto/user/user';
import { ProductPagination } from '../_model-dto/product/product-pagination';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingServiceService {

  constructor(private sanitizer: DomSanitizer) { }

  public createMainImageToProdDto(productDto: ProductDTO<any,any>){
    const imageByte: any = productDto.imgdata;
    const imageModel: any = productDto.imgModel;

    const imageBlob = this.dataURItoBlob(imageByte, imageModel.imgType);

    const imageFile = new File([imageBlob], imageModel.imgName, { type: imageModel.imgType })

    const finalFileHandle : FileHandle = {
      file: imageFile,
      url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
    };

    productDto.productResponse.mainImage = finalFileHandle

    return productDto;
  }

  public createMainAndSubImagesToProdDto(productDto: ProductDTO<any,any>){
    const productImagesBytes: any[] = productDto.imgdata;
    const productImagesModel: any[] = productDto.imgModel;

    const productSubImagesToFileHandle: FileHandle[] = [];

    for(let i=0; i<productImagesBytes.length; i++){
      const imageByte = productImagesBytes[i];
      const imageModel = productImagesModel[i];

      const imageBlob = this.dataURItoBlob(imageByte, imageModel.imgType);

      const imageFile = new File([imageBlob], imageModel.imgName, { type: imageModel.imgType })

      const finalFileHandle : FileHandle = {
        file: imageFile,
        url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
      };

      if(i==0) productDto.productResponse.mainImage = finalFileHandle;
      else productSubImagesToFileHandle.push(finalFileHandle);
    }
    productDto.productResponse.subImages = productSubImagesToFileHandle;

    return productDto;   
  }

  public createBrandImage(brand: Brand){
    const imageByte: any = brand.image;

    const imageBlob = this.dataURItoBlob(imageByte, brand.imageType);

    const imageFile = new File([imageBlob], brand.imageName, { type: brand.imageType })

    const finalFileHandle : FileHandle = {
      file: imageFile,
      url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
    };

    brand.brandImage = finalFileHandle

    return brand;
  }

  public createAllImagesToProdDto(productDto: ProductDTO<any,any>){
    const productImagesBytes: any[] = productDto.imgdata;
    const productImagesModel: any[] = productDto.imgModel;

    const productSubImagesToFileHandle: FileHandle[] = [];
    const productAllImagesToFileHandle: FileHandle[] = [];

    for(let i=0; i<productImagesBytes.length; i++){
      const imageByte = productImagesBytes[i];
      const imageModel = productImagesModel[i];

      const imageBlob = this.dataURItoBlob(imageByte, imageModel.imgType);

      const imageFile = new File([imageBlob], imageModel.imgName, { type: imageModel.imgType })

      const finalFileHandle : FileHandle = {
        file: imageFile,
        url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
      };

      if(i==0) productDto.productResponse!.mainImage = finalFileHandle;
      else productSubImagesToFileHandle.push(finalFileHandle);

      productAllImagesToFileHandle.push(finalFileHandle);
    }
    productDto.productResponse!.subImages = productSubImagesToFileHandle;
    productDto.productResponse!.allImages = productAllImagesToFileHandle;

    return productDto;   
  }

  public createCategoryImage(category: Category){
    const imageByte: any = category.image;

    const imageBlob = this.dataURItoBlob(imageByte, category.imageType);

    const imageFile = new File([imageBlob], category.imageName, { type: category.imageType })

    const finalFileHandle : FileHandle = {
      file: imageFile,
      url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
    };

    category.categoryImage = finalFileHandle

    return category;
  }

  public createUserImage(user: User){
    const imageByte: any = user.image;

    const imageBlob = this.dataURItoBlob(imageByte, user.imageType);

    const imageFile = new File([imageBlob], user.imageName, { type: user.imageType })

    const finalFileHandle : FileHandle = {
      file: imageFile,
      url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
    };

    user.userImage = finalFileHandle

    return user;
  }

  public dataURItoBlob(picBytes: string, imageType: string){
    const byteString = window.atob(picBytes);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);

    for(let i=0; i<byteString.length; i++){
      int8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([int8Array], { type: imageType });
    return blob;
  }

  public createImagesToPagination(prodPage: ProductPagination<ProductDTO<any,any>>){
    prodPage.listProducts.forEach(product => 
        this.createMainImageToProdDto(product)
    )
    return prodPage;
  }

}


/*
 public createMainImage(productDto: ProductDTO<any,any>){
    const imageByte: any = productDto.imgdata;
    const imageModel: any = productDto.imgModel;

    let productMainImageToFileHandle: FileHandle ;

    const imageBlob = this.dataURItoBlob(imageByte, imageModel.imgType);

    const imageFile = new File([imageBlob], imageModel.imgName, { type: imageModel.imgType })

    const finalFileHandle : FileHandle = {
      file: imageFile,
      url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
    };

    productMainImageToFileHandle = finalFileHandle;

    return productMainImageToFileHandle;
  }

  public createMainAndSubImages(productDto: ProductDTO<any,any>){
    const productImagesBytes: any[] = productDto.imgdata;
    const productImagesModel: any[] = productDto.imgModel;

    let productMainImageToFileHandle: FileHandle | undefined = undefined;
    const productSubImagesToFileHandle: FileHandle[] = [];

    for(let i=0; i<productImagesBytes.length; i++){
      const imageByte = productImagesBytes[i];
      const imageModel = productImagesModel[i];

      const imageBlob = this.dataURItoBlob(imageByte, imageModel.imgType);

      const imageFile = new File([imageBlob], imageModel.imgName, { type: imageModel.imgType })

      const finalFileHandle : FileHandle = {
        file: imageFile,
        url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
      };

      if(i==0) productMainImageToFileHandle = finalFileHandle;
      else productSubImagesToFileHandle.push(finalFileHandle);
    }

    return { mainImage: productMainImageToFileHandle , subImages: productSubImagesToFileHandle};   
  }
*/