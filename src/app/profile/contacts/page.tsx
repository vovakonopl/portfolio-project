'use client';

import { FC, useState } from 'react';
import { useTrinketUser } from '@/scripts/user';
import ProfileLoading from '../_components/loading';
import ToHome from '../_components/return-to-home';
import Title from '../_components/title';
import EditButton from '../_components/edit-button';
import PhoneForm from './_components/phone-form';
import PhoneNumbers from './_components/phone-numbers';
import AdditionalContacts from './_components/aditional-contacts';
import ContactForm from './_components/contacts-form';

enum EModals {
  phoneNumber,
  additionalContacts,
}
interface IContactsProps {}

const Contacts: FC<IContactsProps> = () => {
  const [activeModal, setActiveModal] = useState<EModals | null>(null);
  const { user, isLoaded } = useTrinketUser();

  if (!isLoaded) {
    return <ProfileLoading />;
  }
  if (!user) {
    return <ToHome />;
  }

  return (
    <div className="flex w-fit flex-col gap-2 pl-4 max-sm:mx-auto max-sm:gap-4 max-sm:px-10">
      <div className="flex flex-wrap items-start">
        <Title className="min-w-44 max-sm:min-w-fit">Email: </Title>
        <address>{user.email}</address>
      </div>
      <div className="flex flex-wrap items-start">
        <Title className="min-w-44 max-sm:min-w-fit">
          {/* 3 numbers maximum */}
          {user.phoneNumbers.length < 3 ? (
            <EditButton
              onClick={() => setActiveModal(EModals.phoneNumber)}
              iconLeft
              className="-ml-4"
            >
              Phone numbers:{' '}
            </EditButton>
          ) : (
            'Phone numbers: '
          )}
        </Title>

        <PhoneNumbers />

        {activeModal === EModals.phoneNumber && (
          <PhoneForm closeModal={() => setActiveModal(null)} />
        )}
      </div>
      <div className="flex flex-wrap items-start">
        <Title className="min-w-44 max-sm:min-w-fit">
          {user.additionalContacts.length < 6 ? (
            <EditButton
              onClick={() => setActiveModal(EModals.additionalContacts)}
              iconLeft
              className="-ml-4"
            >
              Additional contacts:{' '}
            </EditButton>
          ) : (
            'Additional contacts: '
          )}
        </Title>

        <AdditionalContacts />
        {activeModal === EModals.additionalContacts && (
          <ContactForm closeModal={() => setActiveModal(null)} />
        )}
      </div>
    </div>
  );
};

export default Contacts;
