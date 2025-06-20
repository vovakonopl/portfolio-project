import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Product } from '@/app/shop/upload-product/_utils/structures/product';
import { SecondaryOption } from '@/app/shop/upload-product/_utils/structures/secondary-option';

function isProduct(item: any): item is Product {
  // Verify the object by its key if it was created not with class constructor
  const keyForProduct = 'optionName';
  return item instanceof Product || keyForProduct in new Product();
}

export function reorderOptionsArray<T extends Product | SecondaryOption>(
  e: DragEndEvent,
  options: T[],
): T[] | null {
  const { active, over } = e;
  if (!over) return null;
  if (active.id === over?.id) return null;

  const findOptionIdx = (name: string): number => {
    return options.findIndex((option: T) => {
      if (isProduct(option)) {
        return option.optionName === name;
      }

      return option.displayedName === name;
    });
  };

  const oldIdx: number = findOptionIdx(active.id as string);
  const newIdx: number = findOptionIdx(over?.id as string);
  return arrayMove(options, oldIdx, newIdx);
}
