import { cn } from '@/lib/cn';
import { cloneElement, FC } from 'react';

interface ITooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  tooltip: string;
  tooltipId: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  hoverable?: boolean;
}

const Tooltip: FC<ITooltipProps> = ({
  children,
  tooltip,
  tooltipId,
  position,
  hoverable,
  ...props
}) => {
  // link the tooltip with child component
  const childWithTooltip = cloneElement(children as React.ReactElement, {
    'aria-describedby': tooltipId,
  });

  const baseStyles: string =
    'tooltip invisible absolute z-10 w-max rounded bg-zinc-600 bg-opacity-65 px-2 py-1 text-white opacity-0 transition-all';
  const afterStyles: string =
    'after:absolute after:border-[0.375rem] after:border-transparent after:border-opacity-65';

  return (
    <div
      {...props}
      className={cn('tooltip-container relative', props.className)}
    >
      {childWithTooltip}
      <span
        id={tooltipId}
        className={cn(
          hoverable && 'tooltip-hoverable',
          baseStyles,
          afterStyles,
          position || 'right',
        )}
      >
        {tooltip}
      </span>
    </div>
  );
};

export default Tooltip;
