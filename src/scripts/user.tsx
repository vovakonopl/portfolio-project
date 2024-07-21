'use client';

import { useUser } from '@clerk/nextjs';
import { Contact, User } from '@prisma/client';
import {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { UserResource } from '@clerk/types/dist/index';
import { adjustContactArrays } from './adjust-contact-arrays';
import { UserWithContacts } from '@/types/user';

type UpdateContactsParams =
  | {
      method: 'POST';
      body: string;
      href?: string;
    }
  | {
      method: 'DELETE';
      id: string;
    };

interface IUserProvider {
  user: UserWithContacts | null | undefined;
  clerkUser: UserResource | null | undefined;
  isLoaded: boolean;
  updateUser: (params: Partial<User>, options?: { noFetch?: boolean }) => void;
  updateContacts: (params: UpdateContactsParams) => Promise<void>;
}

const UserContext = createContext<IUserProvider | undefined>(undefined);

const UserProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserWithContacts | null | undefined>(
    undefined,
  );
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(false);
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();

  const fetchUser = useCallback(async () => {
    const resp = await fetch('/api/profile');
    if (!resp.ok) {
      setUser(null);
      setIsUserLoaded(true);
      return;
    }

    const data: UserWithContacts = await resp.json();

    setUser(data);
    setIsUserLoaded(true);
  }, []);

  const updateUser = useCallback(
    (params: Partial<UserWithContacts>, options?: { noFetch?: boolean }) => {
      if (!user) return;

      const userData: UserWithContacts = { ...user, ...params };

      // in case extra data was added => cut it
      adjustContactArrays(userData);

      setUser(userData);

      // In case we want to update only user state (db data will be updated in clerk webhook)
      if (options?.noFetch) return;

      fetch('/api/profile', {
        method: 'PATCH',
        body: JSON.stringify(params),
      });
    },
    [user],
  );
  const updateContacts = useCallback(
    async (params: UpdateContactsParams) => {
      if (!user) return;

      const userData: UserWithContacts = { ...user };

      const { method, ...body } = params;

      const respPromise = fetch('/api/profile/contacts', {
        method,
        body: JSON.stringify(body),
      });

      // update state
      if (method === 'DELETE') {
        userData.additionalContacts = userData.additionalContacts.filter(
          (contact: Contact) => contact.id !== params.id,
        );

        setUser(userData);
      }

      if (method === 'POST') {
        const resp = await respPromise;
        if (!resp.ok) {
          console.error('Can not add new contact.');
          return;
        }

        const contact: Contact = await resp.json();
        userData.additionalContacts.push(contact);

        setUser(userData);
      }
    },
    [user],
  );

  useEffect(() => {
    if (isSignedIn) {
      fetchUser();
    }
  }, [isSignedIn, fetchUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        clerkUser,
        isLoaded: isUserLoaded && isClerkLoaded,
        updateUser,
        updateContacts,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useTrinketUser = (): IUserProvider => {
  const context = useContext(UserContext)!;

  if (context.isLoaded && context.clerkUser && !context.user) {
    console.error('User exists but was not found.');
  }

  return context;
};
