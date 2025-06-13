import { cn } from '@/lib/cn';
import { FC } from 'react';

interface ITooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement;
  tooltip: string;
  tooltipClassName?: string;
  tooltipId: string; // used for 'aria-describedby' attribute inside another element
  position?: 'top' | 'bottom' | 'left' | 'right';
  hoverable?: boolean;
}

const Tooltip: FC<ITooltipProps> = ({
  children,
  tooltip,
  tooltipClassName,
  tooltipId,
  position,
  hoverable,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn('tooltip-container relative', props.className)}
    >
      {children}
      <span
        id={tooltipId}
        className={cn(
          'tooltip invisible absolute z-10 w-max max-w-[50dvw] whitespace-pre-line rounded',
          'bg-zinc-600 bg-opacity-65 px-2 py-1 text-white opacity-0 transition-all',
          'after:absolute after:border-[0.375rem] after:border-transparent after:border-opacity-65',
          hoverable && 'tooltip-hoverable',
          position || 'right',
          tooltipClassName,
        )}
      >
        {tooltip}
      </span>
    </div>
  );
};

export default Tooltip;
