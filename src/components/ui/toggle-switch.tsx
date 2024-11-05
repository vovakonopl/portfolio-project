import { FC } from 'react';
import { cn } from '@/lib/cn';

interface ILabelProps {
  children: React.ReactNode;
  isSelected: boolean;
}
const SwitchLabel: FC<ILabelProps> = ({ children, isSelected }) => {
  return (
    <p
      className={cn(
        'font-medium text-gray-300 transition-colors',
        isSelected && 'text-black',
      )}
    >
      {children}
    </p>
  );
};

interface IToggleSwitchProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  checked: boolean;
  checkedClassName?: string;
  toggle: (state: boolean) => void;
  uncheckedLabel?: string;
  checkedLabel?: string;
}

export const ToggleSwitch: FC<IToggleSwitchProps> = ({
  id,
  checked,
  checkedClassName,
  toggle,
  uncheckedLabel,
  checkedLabel,
  ...props
}) => {
  const baseClassName =
    'relative h-8 w-16 cursor-pointer rounded-full bg-neutral-200 shadow-inner transition-all after:absolute after:left-1 after:top-1/2 after:size-6 after:-translate-y-1/2 after:rounded-full after:bg-white after:shadow after:transition-all hover:shadow-black/30';

  return (
    <div className="flex gap-2">
      {uncheckedLabel && (
        <SwitchLabel isSelected={!checked}>{uncheckedLabel}</SwitchLabel>
      )}

      <div
        {...props}
        className={cn(
          baseClassName,
          checked &&
            cn(
              'switch-translate-left bg-blue-400 after:left-full',
              checkedClassName,
            ),
          props.className,
        )}
        onClick={() => toggle(!checked)}
      >
        <input
          id={id}
          checked={checked}
          readOnly
          type="checkbox"
          className="opacity-0"
        />
      </div>

      {uncheckedLabel && (
        <SwitchLabel isSelected={checked}>{checkedLabel}</SwitchLabel>
      )}
    </div>
  );
};
