import { FC } from 'react';
import ExternalAccount from './external-account';

interface IAuthProvidersProps {}

const AuthProviders: FC<IAuthProvidersProps> = () => {
  return (
    <ul className="flex flex-col gap-2 max-md:mx-auto max-md:gap-1">
      <li>
        <ExternalAccount provider="google">
          <div className="google-icon mr-2 size-5"></div>
          Google
        </ExternalAccount>
      </li>
      <li>
        <ExternalAccount provider="facebook">
          <div className="facebook-icon mr-2 size-5"></div>
          Facebook
        </ExternalAccount>
      </li>
      <li>
        <ExternalAccount provider="apple">
          <div className="apple-icon mr-2 size-5"></div>
          Apple
        </ExternalAccount>
      </li>
    </ul>
  );
};

export default AuthProviders;
