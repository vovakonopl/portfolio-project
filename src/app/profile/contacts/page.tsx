'use client';

import { RedirectToSignIn, useUser } from '@clerk/nextjs';
import { FC } from 'react';
import ProfileLoading from '../_profile-components/loading';

interface IContactsProps {}

const Contacts: FC<IContactsProps> = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <ProfileLoading />;
  }
  if (isLoaded && !user) {
    return <RedirectToSignIn />;
  }

  return (
    <>
      <div>Contacts</div>
    </>
  );
};

export default Contacts;
