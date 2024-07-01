'use client';

import { useUser } from '@clerk/nextjs';
import { User } from '@prisma/client';
import {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { UserResource } from '@clerk/types/dist/index';

interface IUserProvider {
  user: User | null | undefined;
  clerkUser: UserResource | null | undefined;
  isLoaded: boolean;
  updateUser: (params: Partial<User>) => void;
}

const UserContext = createContext<IUserProvider | undefined>(undefined);

const UserProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(false);
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();

  const fetchUser = useCallback(async () => {
    const resp = await fetch('/api/user');
    if (!resp.ok) {
      setUser(null);
      setIsUserLoaded(true);
      return;
    }
    const data: User = await resp.json();

    setUser(data);
    setIsUserLoaded(true);
  }, []);
  const updateUser = useCallback(
    (params: Partial<User>) => {
      if (!user) return;
      const userData: User = { ...user, ...params };
      setUser(userData);
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
