import { FC } from 'react';
import { UserResource } from '@clerk/types/dist/index';
import { User } from '@prisma/client';

interface IUserAboutProps {
  user: User;
  clerkUser: UserResource;
}

const UserAbout: FC<IUserAboutProps> = ({ user, clerkUser }) => {
  return (
    <div className="word-break flex flex-col break-words max-md:text-center">
      <div>
        <span className="">
          <span className="mr-2 text-gray-400">Full name: </span>
          {user.firstName} {user.lastName}
        </span>
      </div>
      <div>
        <span className={user.username ? '' : 'italic'}>
          <span className="mr-2 not-italic text-gray-400">Username: </span>
          {user.username || 'No username'}
        </span>
      </div>
      <div>
        <p>
          <span className="mr-2 not-italic text-gray-400">BIO: </span>
          {/* {user.bio || 'No BIO yet'} */}
          No BIO yet
        </p>
      </div>
    </div>
  );
};

export default UserAbout;
