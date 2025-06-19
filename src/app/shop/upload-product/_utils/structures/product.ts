import { Category, SubCategory } from '@prisma/client';

export class Product {
  public name: string;
  public price: number;
  public images: Array<File>;
  public category: Category;
  public subcategory: SubCategory;
  public description?: string;

  // additional properties for variants (multiple variants mode)
  public optionName?: string;

  constructor(params?: Partial<Product>) {
    // initial values
    this.name = '';
    this.price = 0;
    this.images = [];
    this.category = {} as Category;
    this.subcategory = {} as SubCategory;
    this.description = '';
    this.optionName = 'Option';

    Object.assign(this, params);
  }
}
