import { ProductResponse } from "./product-response"

export interface ProductDTO<T,D>{
  productResponse: ProductResponse
  imgdata: T
  imgModel: D
}


/*
"imgModel": 
        {
            "id": 1,
            "filePath": "path\\images\\1\\",
            "imgName": "aio-b.png",
            "imgType": "image/png"
        }

*/