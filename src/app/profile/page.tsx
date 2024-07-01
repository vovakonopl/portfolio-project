'use client';

import { ChangeEvent, FC, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTrinketUser } from '@/scripts/user';
// components
import ProfileLoading from './_profile-components/loading';
import Image from 'next/image';
import UserAbout from './_profile-components/user-about';
import EditProfile from './_profile-components/edit-button';
import UserAboutForm from './_profile-components/user-about-form';

type ImageUploader = (e: ChangeEvent<HTMLInputElement>) => void;

interface IProfileProps {}

const Profile: FC<IProfileProps> = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { user, clerkUser, isLoaded } = useTrinketUser();
  const router = useRouter();

  const updateProfielImage: ImageUploader = useCallback<ImageUploader>(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const image: File | undefined = e.target.files?.[0];
      if (!image) return;

      clerkUser?.setProfileImage({
        file: image,
      });
    },
    [clerkUser],
  );

  if (!isLoaded) {
    return <ProfileLoading />;
  }
  if (isLoaded && (!clerkUser || !user)) {
    router.replace('/');
    return <></>;
  }

  const toggleEditing = (): void => {
    setIsEditing((previousState: boolean) => !previousState);
  };

  return (
    <>
      <div className="flex flex-1 gap-4 max-md:flex-col max-md:items-center">
        <div className="flex flex-col gap-4">
          {/* user avatar */}
          <div className="avatar relative flex size-36 rounded-full max-md:size-24">
            <Image
              src={clerkUser!.imageUrl}
              alt="avatar"
              width={500}
              height={500}
              className="rounded-full object-cover"
              priority={true}
            />
            <div className="avatar__upload absolute inset-0 rounded-full bg-black bg-opacity-70 bg-center bg-no-repeat opacity-0 transition-opacity ease-in"></div>
            <input
              type="file"
              onChange={updateProfielImage}
              accept="image/*"
              className="absolute size-full cursor-pointer rounded-full opacity-0"
              title=""
            />
          </div>

          {/* edit button on larger screens*/}
          <EditProfile
            onClick={toggleEditing}
            containerClassName="max-md:hidden"
          >
            Edit profile
          </EditProfile>
        </div>

        {/* about user */}
        {isEditing ? (
          <UserAboutForm toggleEditing={toggleEditing} />
        ) : (
          <UserAbout user={user!} clerkUser={clerkUser!} />
        )}

        {/* edit button on smaller screens*/}
        <EditProfile
          onClick={toggleEditing}
          containerClassName="hidden max-md:flex"
        >
          Edit profile
        </EditProfile>
      </div>
    </>
  );
};

export default Profile;
