'use client';

import { ChangeEvent, FC, useCallback, useState } from 'react';
import { useTrinketUser } from '@/scripts/user';
import ProfileLoading from './_components/loading';
import Image from 'next/image';
import UserAbout from './_components/about';
import EditButton from './_components/edit-button';
import UserAboutForm from './_components/about-form';
import ToHome from './_components/return-to-home';
import AuthProviders from './_components/auth-providers';

type ImageUploader = (e: ChangeEvent<HTMLInputElement>) => void;

interface IProfileProps {}

const Profile: FC<IProfileProps> = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { user, clerkUser, isLoaded } = useTrinketUser();

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
  if (!user || !clerkUser) {
    return <ToHome />;
  }

  const toggleEditing = (): void => {
    setIsEditing((previousState: boolean) => !previousState);
  };

  return (
    <div className="flex flex-1 flex-col gap-12 max-md:justify-center">
      <div className="flex flex-1 gap-4 max-md:flex-col max-md:items-center">
        <div className="flex flex-col gap-4">
          {/* user avatar */}
          <div className="avatar relative flex size-36 rounded-full max-md:size-24">
            <Image
              src={clerkUser.imageUrl}
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
          {!isEditing && (
            <div className="flex flex-1 items-start justify-center font-normal text-gray-400 max-md:hidden">
              <EditButton onClick={toggleEditing} className="pl-4">
                Edit profile
              </EditButton>
            </div>
          )}
        </div>

        {/* about user */}
        {isEditing ? (
          <UserAboutForm toggleEditing={toggleEditing} />
        ) : (
          <UserAbout user={user} />
        )}

        {/* edit button on smaller screens*/}
        {!isEditing && (
          <div className="hidden flex-1 items-start justify-center font-normal text-gray-400 max-md:flex">
            <EditButton onClick={toggleEditing} className="pl-4">
              Edit profile
            </EditButton>
          </div>
        )}
      </div>
      {!isEditing && (
        <div className="flex flex-col gap-4 max-md:gap-2">
          {/* OAuth providers */}
          <h2 className="text-center text-lg font-medium">
            Connect your account with socials
          </h2>

          <AuthProviders />
        </div>
      )}
    </div>
  );
};

export default Profile;
