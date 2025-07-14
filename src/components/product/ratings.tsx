import { FC } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

interface IStarsProps {
  className?: string;
}

const Stars: FC<IStarsProps> = ({ className }) => {
  return (
    <div className="flex w-fit gap-px">
      {Array.from({ length: 5 }).map((_, idx) => (
        <Star className={cn('size-5', className)} key={idx} />
      ))}
    </div>
  );
};

interface IRatingsProps {
  className?: string;
  rating: number;
  ratingsCount: number;
  starClassName?: string;
}

const Ratings: FC<IRatingsProps> = ({
  className,
  rating,
  ratingsCount,
  starClassName,
}) => {
  const ratingPercent: number = rating * 20; // max rating is 5
  const width: string = `${ratingPercent}%`;

  return (
    <div className={cn('flex flex-wrap items-center gap-1', className)}>
      {/* stars */}
      <div className="relative w-fit">
        {/* placeholder with gray stars */}
        <div className="flex">
          <Stars
            className={cn('fill-slate-200 text-slate-200', starClassName)}
          />
        </div>

        {/* actual rating in stars */}
        <div
          className="absolute left-0 top-0 h-full overflow-clip"
          style={{ width }}
        >
          <Stars
            className={cn(
              'inline fill-yellow-400 text-yellow-400',
              starClassName,
            )}
          />
        </div>
      </div>

      {/* details */}
      <div className="line-h-1 flex gap-1 text-sm">
        <span>{rating.toFixed(1)}</span>
        <span className="text-gray-500">({ratingsCount} ratings)</span>
      </div>
    </div>
  );
};

export default Ratings;
