import { FC } from 'react';
import { Contact } from '@prisma/client';
import DeleteButton from './delete-button';
import { useTrinketUser } from '@/scripts/user';

interface IAdditionalContactsProps {}

const AdditionalContacts: FC<IAdditionalContactsProps> = () => {
  const { user, updateContacts } = useTrinketUser();

  if (!user) {
    return <></>;
  }

  if (user.additionalContacts.length === 0) {
    return (
      <div className="italic">
        <span>None</span>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    updateContacts({ method: 'DELETE', id });
  };

  return (
    <ul className="word-break break-words max-sm:mx-auto">
      {user?.additionalContacts.map((contact: Contact) => (
        <li key={contact.id} className="flex gap-2">
          <address>
            {contact.url ? (
              <a
                href={contact.url}
                className="text-blue-500 underline-offset-2 hover:underline"
              >
                {contact.body}
              </a>
            ) : (
              contact.body
            )}
          </address>

          <DeleteButton
            onClick={() => {
              handleDelete(contact.id);
            }}
          />
        </li>
      ))}
    </ul>
  );
};

export default AdditionalContacts;
