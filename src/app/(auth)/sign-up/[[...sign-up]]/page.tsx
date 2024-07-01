import { SignUp } from '@clerk/nextjs';
import { FC } from 'react';

interface ISignUpPageProps {}

const SignUpPage: FC<ISignUpPageProps> = () => {
  return (
    <div className="container flex flex-1 items-center justify-center pb-2">
      <SignUp
        appearance={{
          elements: {
            card: 'z-0',
          },
        }}
      />
    </div>
  );
};

export default SignUpPage;
