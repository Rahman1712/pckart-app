import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Category } from '../_model-dto/category/category';
import { Observable } from 'rxjs';
import { ProductDTO } from '../_model-dto/product/product-dto';
import { ProductDetails } from '../_model-dto/product/product-details';
import { ProductPagination } from '../_model-dto/product/product-pagination';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiProductUrl = environment.apiProductUrl;
  private apiBrandUrl = environment.apiBrandUrl;
  private apiCategoryUrl = environment.apiCategoryUrl;


  constructor(private http: HttpClient) { 

  }

  // ====================Count of products by category===============//
  public countProductsByCategoryName(categoryName: string): Observable<any>{
    return this.http.get(`${this.apiProductUrl}/get/product-count/by-category-name/${categoryName}`, { responseType: 'text' });
  }
  /*
  public countProductsByCategoryName(categoryName: string): Observable<number> {
    return this.http.get(`${this.apiProductUrl}/get/product-count/by-category-name/${categoryName}`, { responseType: 'text' })
      .pipe(
        map((count: string) => parseInt(count, 10))  // argument 10 specifying the base for the parsing.
      );
  }
*/

  public getAllParentCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(`${this.apiCategoryUrl}/get/all-parent-categories`);
  }
  public getAllParentCategoriesIdAndNameNoImage(): Observable<Category[]>{
    return this.http.get<Category[]>(`${this.apiCategoryUrl}/get/all-categories-noimage`);
  }
  public getAllSubcategoriesIdAndNameNoImage(parentCategory: string): Observable<Category[]>{
    return this.http.get<Category[]>(`${this.apiCategoryUrl}/get/all-subcategories-noimage/by-parent/${parentCategory}`);
  }

  public getAllCategoriesByParentName(parentCategory: string): Observable<Category[]>{
    return this.http.get<Category[]>(`${this.apiCategoryUrl}/get/all-categories/by-parent/${parentCategory}`);
  }

  public getAllCategoriesWithImgs(): Observable<Category[]>{
    return this.http.get<Category[]>(`${this.apiCategoryUrl}/get/all-categories`);
  }
  
  public getAllSubCategoriesWithImgs(): Observable<Category[]>{
    return this.http.get<Category[]>(`${this.apiCategoryUrl}/get/all-sub-categories`);
  }

  public getParentCategoryNameByCategory(categoryName: string): Observable<string>{
    return this.http.get(`${this.apiCategoryUrl}/get/parent-category/bycategory/${categoryName}`, {responseType: 'text'});
  }

  /*============== products=======================================*/
	public getProductsByParentCategoryName(parentName: string):Observable<ProductDTO<any,any>[]> {
    return this.http.get<ProductDTO<any,any>[]>(`${this.apiProductUrl}/get/all/bycategory/parent/byname/${parentName}`);
	}

	/*public getProductsByParentCategoryNameAndFilter(
    parentName: string,
    brandNames: string[],
    minPrice: number,
    maxPrice: number,
    colors: string[]):Observable<ProductDTO<any,any>[]> 
  {
    return this.http.get<ProductDTO<any,any>[]>(`${this.apiProductUrl}/get/all/bycategory/filter/parent/byname/${parentName}`, {
      params: {
        brandNames: brandNames.join(','),
        minPrice: minPrice.toString(),
        maxPrice: maxPrice.toString(),
        colors: colors.join(',')
      }
    });
	}*/
  public getProductsByParentCategoryNameAndFilter(
    parentName: string,filterOptions: any):Observable<ProductDTO<any,any>[]> 
  {
    return this.http.get<ProductDTO<any,any>[]>(`${this.apiProductUrl}/get/all/bycategory/filter/parent/byname/${parentName}`, { params: filterOptions });
	}
  public getProductsByCategoryNameAndFilter(
    categoryName: string,filterOptions: any):Observable<ProductDTO<any,any>[]> 
  {
    return this.http.get<ProductDTO<any,any>[]>(`${this.apiProductUrl}/get/all/bycategory/filter/byname/${categoryName}`, { params: filterOptions });
	}

	public getProductsByCategoryName(categoryName: string):Observable<ProductDTO<any,any>[]> {
    return this.http.get<ProductDTO<any,any>[]>(`${this.apiProductUrl}/get/all/bycategory/byname/${categoryName}`);
	}

  public getProductByIdWithImages(productId: number): Observable<ProductDTO<any,any>>{
    return this.http.get<ProductDTO<any,any>>(`${this.apiProductUrl}/get/product-imgs/${productId}`);
  }

  public getProductDetailsMainImageById(productId: number): Observable<ProductDTO<any,any>>{
    return this.http.get<ProductDTO<any,any>>(`${this.apiProductUrl}/get/product/${productId}`);
  }


  /*============== products grandtotal==================================*/
  public grandTotalofProducts(products: ProductDetails[]): Observable<any>{
    return this.http.post<any>(`${this.apiProductUrl}/get/total-of-products`, products);
  }

  /* ========================== PRODUCTS GET BY SEARCK KEYWORD AND LIMIT=============================== */
  public getAllProductsByKeywordAndLimit(searchKeyword: string, limit: number):Observable<ProductDTO<any,any>[]>{
    const params = {
      searchKeyword: searchKeyword,
      limit: limit,
    }
    return this.http.get<ProductDTO<any,any>[]>(`${this.apiProductUrl}/get/all/bySearch_and_Limit`, {params: params});
  }
  
  /* ========================== PRODUCT PAGINATION GET =============================== */
  ///get/page-imgs/1?sortField=name&sortDir=asc&limit=5.....
  public getProductsWithImagesAndPagination(pageNum:number,limit:number,sortField:string, sortDir:string, searchKeyword:string): Observable<ProductPagination<ProductDTO<any,any>>>{
    const params = new HttpParams()
      .set('limit',limit).set('sortField',sortField)
      .set('sortDir',sortDir).set('searchKeyword',searchKeyword);
    
      return this.http.get<ProductPagination<ProductDTO<any,any>>>(`${this.apiProductUrl}/get/page-imgs/${pageNum}`,{params});
  }
}
