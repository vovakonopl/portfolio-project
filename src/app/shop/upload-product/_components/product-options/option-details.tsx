import { FC } from 'react';
import { SecondaryOption } from '@/app/shop/upload-product/_utils/structures/secondary-option';

interface IOptionDetailsProps {
  option: SecondaryOption;
}

const OptionDetails: FC<IOptionDetailsProps> = ({ option }) => {
  return (
    <div className="option__details">
      <h5 className="text-center font-medium">Option details</h5>

      <div className="text-sm">
        <p>
          <span className="mr-2 font-medium">Addition to name:</span>
          <span
            className={
              option.name
                ? 'underline underline-offset-2'
                : 'italic text-gray-500'
            }
          >
            {option.name || 'none'}
          </span>
        </p>
      </div>

      <div className="text-sm">
        <p>
          <span className="mr-2 font-medium">Addition to price:</span>
          <span className="underline underline-offset-2">
            {(option.priceInCents / 100).toFixed(2)}$
          </span>
        </p>
      </div>
    </div>
  );
};

export default OptionDetails;
