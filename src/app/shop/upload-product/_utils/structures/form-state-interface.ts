import { IProduct } from '@/app/shop/upload-product/_utils/structures/product-interface';

export interface IFormState {
  isMultipleMode: boolean;
  // main product is a first item in the array
  variants: Array<IProduct>; // multiple variants mode
  // additionalServices: ...;
}