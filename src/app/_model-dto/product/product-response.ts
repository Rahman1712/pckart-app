import { FileHandle } from "../file-handle.model"

export interface ProductResponse{
   productId: number
	 productName: string
	 productPrice: number
	 productQuantity: number 
	 productDiscount: number
	 productColor: string
	 productDescription: string
	 productSpecs: any

	 brandId: number
	 brandName: string

	 categoryId: number
	 categoryName: string

	 added_at: any

	 mainImage: FileHandle
	 subImages: FileHandle[]
	 allImages: FileHandle[]

	 parentCategoryName: string
}