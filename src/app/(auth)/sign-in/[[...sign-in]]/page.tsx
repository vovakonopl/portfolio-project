import { FC } from 'react';
import { SignIn } from '@clerk/nextjs';

interface ISignInPageProps {}

const SignInPage: FC<ISignInPageProps> = () => {
  return (
    <div className="container flex flex-1 items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            card: 'z-0',
          },
        }}
      />
    </div>
  );
};

export default SignInPage;
