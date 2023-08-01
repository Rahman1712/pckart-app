import { FileHandle } from "../file-handle.model";

export class Category{
  id: number;
  name: string;
  parent: Category;
  image: any;
  imageName: any;
  imageType: string;

  categoryImage: FileHandle;

  subcategories: Category[];
}
