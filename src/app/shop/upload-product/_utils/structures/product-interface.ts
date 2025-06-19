import { Category, SubCategory } from '@prisma/client';

export interface IProduct {
  idx: number; // index of the product in the list

  name: string;
  price: number;
  images: Array<File>;
  category: Category;
  subcategory: SubCategory;
  description?: string;

  // additional properties for variants (multiple variants mode)
  optionGroup?: string;
  optionName?: string;
}
