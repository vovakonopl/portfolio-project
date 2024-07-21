import { FC } from 'react';
import DeleteButton from './delete-button';
import { useTrinketUser } from '@/scripts/user';

interface IPhoneNumbers {}

const PhoneNumbers: FC<IPhoneNumbers> = () => {
  const { user, updateUser } = useTrinketUser();

  if (!user) {
    return <></>;
  }

  if (user.phoneNumbers.length === 0) {
    return (
      <div className="italic">
        <span>None</span>
      </div>
    );
  }

  const handleDelete = (phoneNumToDelete: string) => {
    const phoneNumbers: Array<string> = user.phoneNumbers.filter(
      (phoneNum) => phoneNum !== phoneNumToDelete,
    );

    updateUser({ phoneNumbers });
  };

  return (
    <ul>
      {user?.phoneNumbers.map((phoneNumber: string) => (
        <li key={Math.random()} className="flex gap-2">
          <address>{phoneNumber}</address>
          <DeleteButton
            onClick={() => {
              handleDelete(phoneNumber);
            }}
          />
        </li>
      ))}
    </ul>
  );
};

export default PhoneNumbers;
