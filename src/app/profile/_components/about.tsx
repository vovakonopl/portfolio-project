import { FC, Fragment } from 'react';
import { UserWithContacts } from '@/types/user';
import Title from './title';
import { cn } from '@/lib/cn';

interface IUserAboutProps {
  user: UserWithContacts;
}

const UserAbout: FC<IUserAboutProps> = ({ user }) => {
  return (
    <div className="word-break flex flex-col break-words max-md:text-center">
      <div className="flex">
        <Title>Full name: </Title>
        <span>
          {user.firstName} {user.lastName}
        </span>
      </div>

      <div className="flex">
        <Title>Username: </Title>
        <span className={cn(user.username && 'italic')}>
          {user.username || 'No username'}
        </span>
      </div>

      <div className="flex">
        <Title>BIO: </Title>
        {!user.bio && <p className="italic">No BIO yet</p>}
        {user.bio && (
          <p>
            {user.bio.split('\n').map((line: string) => (
              <Fragment key={Math.random()}>
                {line}
                <br />
              </Fragment>
            ))}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserAbout;
