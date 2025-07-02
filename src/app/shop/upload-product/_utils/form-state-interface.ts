import { TMainGroup, TOptionGroups } from '@/types/product/option-groups';
import { TServiceMap } from '@/types/product/additional-service';

export interface IFormState {
  isMultipleMode: boolean;
  // main product is a first item in the array

  variants: TMainGroup; // main group
  secondaryOptions: TOptionGroups;
  additionalServices: TServiceMap;
}
