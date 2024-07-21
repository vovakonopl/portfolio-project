import { FC } from 'react';
import ExternalAccount from './external-account';
import Image from 'next/image';

interface IAuthProvidersProps {}

const AuthProviders: FC<IAuthProvidersProps> = () => {
  return (
    <ul className="flex flex-col gap-2 max-md:mx-auto max-md:gap-1">
      <li>
        <ExternalAccount provider="google">
          <Image
            src="/icons/socials/google.svg"
            alt=""
            width={20}
            height={20}
            className="mr-2 inline"
          />
          Google
        </ExternalAccount>
      </li>
      <li>
        <ExternalAccount provider="facebook">
          <Image
            src="/icons/socials/facebook.svg"
            alt=""
            width={20}
            height={20}
            className="mr-2 inline"
          />
          Facebook
        </ExternalAccount>
      </li>
      <li>
        <ExternalAccount provider="apple">
          <Image
            src="/icons/socials/apple.svg"
            alt=""
            width={20}
            height={20}
            className="mr-2 inline"
          />
          Apple
        </ExternalAccount>
      </li>
    </ul>
  );
};

export default AuthProviders;
