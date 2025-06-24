import { PointerEvent, KeyboardEvent, TouchEvent } from 'react';
import { KeyboardSensor, PointerSensor, TouchSensor } from '@dnd-kit/core';

export class InteractivePointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown' as const,
      handler: ({ nativeEvent: event }: PointerEvent) => {
        return isInteractive(event.target as HTMLElement | null);
      },
    },
  ];
}

export class InteractiveTouchSensor extends TouchSensor {
  static activators = [
    {
      eventName: 'onTouchStart' as const,
      handler: ({ nativeEvent: event }: TouchEvent) => {
        return isInteractive(event.target as HTMLElement | null);
      },
    },
  ];
}

export class InteractiveKeyboardSensor extends KeyboardSensor {
  static activators = [
    {
      eventName: 'onKeyDown' as const,
      handler: ({ nativeEvent: event }: KeyboardEvent) => {
        return isInteractive(event.target as HTMLElement | null);
      },
    },
  ];
}

function isInteractive(element: HTMLElement | null): boolean {
  let cur = element;
  while (cur) {
    if (cur.dataset && cur.dataset.noDnd) {
      return false;
    }

    cur = cur.parentElement;
  }

  return true;
}
