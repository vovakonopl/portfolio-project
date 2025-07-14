import { FC } from 'react';
import { cn } from '@/lib/cn';

interface IPriceProps {
  className?: string;
  discountPercent: number | null;
  price: number;
}

const Price: FC<IPriceProps> = ({ className, discountPercent, price }) => {
  if (discountPercent && (discountPercent < 0 || discountPercent >= 1)) {
    throw new Error(
      `Discount percentage out of range! ${discountPercent} out of range [0, 1).`,
    );
  }

  const priceInCents: number = price * 100;
  const priceWithDiscount: number | null = discountPercent
    ? (priceInCents * (1 - discountPercent)) / 100
    : null;

  return (
    <div
      className={cn(
        'flex flex-wrap gap-x-3 text-xl font-bold text-black',
        className,
      )}
    >
      {priceWithDiscount && <span>${priceWithDiscount.toFixed(2)}</span>}

      <div className="flex gap-3">
        <span className={cn(discountPercent && 'text-gray-400 line-through')}>
          ${price.toFixed(2)}
        </span>

        {discountPercent && (
          <span className="rounded-full bg-rose-100 p-1 px-3 text-sm text-rose-600">
            -{Math.floor(discountPercent * 100)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default Price;
