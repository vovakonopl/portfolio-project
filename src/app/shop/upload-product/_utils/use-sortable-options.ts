import { useSortable } from '@dnd-kit/sortable';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

export function useSortableOptions(
  id: string,
  isDisabled: boolean,
  parentListeners?: SyntheticListenerMap,
) {
  const disabledSortableOptions = {
    attributes: {},
    listeners: parentListeners,
    setNodeRef: undefined,
    transform: null,
    transition: undefined,
  };
  const sortable = useSortable({ id });
  
  // remove element stretching or squeezing
  if (sortable.transform?.scaleY) sortable.transform.scaleY = 1;
  if (sortable.transform?.scaleX) sortable.transform.scaleX = 1;

  if (isDisabled) {
    return { ...sortable, ...disabledSortableOptions };
  }

  return { ...sortable };
}
