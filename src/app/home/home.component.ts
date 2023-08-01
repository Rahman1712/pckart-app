import { Component,OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { ImageProcessingServiceService } from '../_services/image-processing-service.service';
import { Category } from '../_model-dto/category/category';
import { HttpErrorResponse } from '@angular/common/http';
// import { map } from 'rxjs';
// import { forkJoin } from 'rxjs';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{


  constructor(private productService: ProductService,
    private imageProcessingService: ImageProcessingServiceService,
  ){}

  subCategoriesList: Category[];
  countMap = new Map();
  limit = 20;

  ngOnInit(): void {
    this.countMap = new Map();
    this.getAllSubCategoriesWithImgs();
  }

  public categoryCount(categoryName: string ): any{
    this.productService.countProductsByCategoryName(categoryName)
    .subscribe({
      next: (next: string) => {
        this.countMap.set(categoryName,next);
        return next;
      },
      error: (error: HttpErrorResponse) => {
        alert(`COUNT ERROR : ${error.message}`);
        return null;
      }
    });
  }

  public getAllSubCategoriesWithImgs(): void {
    this.productService.getAllSubCategoriesWithImgs()
      .pipe(
        map((categories: Category[], i) =>
          categories.map((category: Category) =>
            this.imageProcessingService.createCategoryImage(category)
          )
        )
      )
      .subscribe({
        next: (next: Category[]) => {
          // this.subCategoriesList = next;
          // this.subCategoriesList.forEach(subCat => {
          //   this.categoryCount(subCat.name);
          // });
          // this.sortByProductCountDescending(); // Sort the list after fetching counts

          this.subCategoriesList = next;
          const countRequests = this.subCategoriesList.map((subCat) =>
            this.productService.countProductsByCategoryName(subCat.name)
          );

          forkJoin(countRequests).subscribe((counts: string[]) => {
            this.subCategoriesList.forEach((subCat, index) => {
              this.countMap.set(subCat.name, counts[index]);
            });
            this.sortByProductCountDescending(); // Sort the list after fetching all counts
          });
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message);
        }
      });
  }

  // HomeComponent class (add this method)
  sortByProductCountDescending() {
    this.subCategoriesList.sort((a: Category, b: Category) => {
      const countA = this.countMap.get(a.name) || 0;
      const countB = this.countMap.get(b.name) || 0;
      return countB - countA;
    });
  }

}
