import { FC } from 'react';
import ExternalAccount from './external-account';
// svgs
import Google from '@/assets/icons/socials/google.svg';
import FaceBook from '@/assets/icons/socials/facebook.svg';
import Apple from '@/assets/icons/socials/apple.svg';

interface IAuthProvidersProps {}

const AuthProviders: FC<IAuthProvidersProps> = () => {
  return (
    <ul className="flex flex-col gap-2 max-md:mx-auto max-md:gap-1">
      <li>
        <ExternalAccount provider="google">
          <Google className="mr-2 size-5" />
          Google
        </ExternalAccount>
      </li>
      <li>
        <ExternalAccount provider="facebook">
          <FaceBook className="mr-2 size-5" />
          Facebook
        </ExternalAccount>
      </li>
      <li>
        <ExternalAccount provider="apple">
          <Apple className="mr-2 size-5" />
          Apple
        </ExternalAccount>
      </li>
    </ul>
  );
};

export default AuthProviders;
