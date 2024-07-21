import { FC } from 'react';

interface IProfileLoadingProps {}

const ProfileLoading: FC<IProfileLoadingProps> = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <span className="text-center text-3xl text-gray-400">
        Loading profile...
      </span>
    </div>
  );
};

export default ProfileLoading;
