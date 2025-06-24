import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export function reorderArray<T extends object, K extends keyof T>(
  e: DragEndEvent,
  arr: T[],
  key: K,
): T[] | null {
  const { active, over } = e;
  if (!over) return null;
  if (active.id === over?.id) return null;

  const findOptionIdx = (name: string): number => {
    return arr.findIndex((item: T) => {
      return item[key] === name;
    });
  };

  const oldIdx: number = findOptionIdx(active.id as string);
  const newIdx: number = findOptionIdx(over?.id as string);
  return arrayMove(arr, oldIdx, newIdx);
}
