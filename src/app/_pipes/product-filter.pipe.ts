import { Pipe, PipeTransform } from '@angular/core';
import { ProductResponse } from '../_model-dto/product/product-response';

@Pipe({
  name: 'productFilter'
})
export class ProductFilterPipe implements PipeTransform {

  transform(productsList:  ProductResponse[], brandNames: string[], colors: string[], minPrice: number, maxPrice: number): any {
    if (productsList.length === 0) {
      return productsList;
    }

    const filteredProducts: ProductResponse[] = productsList.filter(product => {
      // Filter based on price range
      const isWithinPriceRange = product.productPrice >= minPrice && product.productPrice <= maxPrice;

      // Filter based on product color
      const isMatchingColor = colors.length === 0 || colors.includes(product.productColor);

      // Filter based on product brand
      const isMatchingBrand = brandNames.length === 0 || brandNames.includes(product.brandName);

      // Return true if all the conditions match
      return isWithinPriceRange && isMatchingColor && isMatchingBrand;
    });

    return filteredProducts;
  }

}
