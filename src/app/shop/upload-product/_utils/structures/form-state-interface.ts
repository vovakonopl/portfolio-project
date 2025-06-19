import {
  TMainGroup,
  TOptionGroups,
} from '@/app/shop/upload-product/_utils/structures/option-groups';

export interface IFormState {
  isMultipleMode: boolean;
  // main product is a first item in the array

  // multiple variants mode
  variants: TMainGroup; // main group
  secondaryOptions: TOptionGroups;

  // additionalServices: ...;
}
