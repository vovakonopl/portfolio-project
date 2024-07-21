import { FC } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type TUserAboutScheme,
  userAboutScheme,
} from '@/scripts/validation-schemes/user-about-scheme';
import { useTrinketUser } from '@/scripts/user';

const Error: FC<{ error: FieldError | undefined }> = ({ error }) => {
  if (!error) return;

  return (
    <div className="text-sm text-rose-500">
      <p>{error.message}</p>
    </div>
  );
};

interface IUserAboutFormProps {
  toggleEditing: () => void;
}

const UserAboutForm: FC<IUserAboutFormProps> = ({ toggleEditing }) => {
  const { user, clerkUser, updateUser } = useTrinketUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TUserAboutScheme>({
    resolver: zodResolver(userAboutScheme),
  });

  const onSubmit = async (data: TUserAboutScheme) => {
    // if data wasn't change
    if (
      data.firstName === clerkUser?.firstName &&
      data.lastName === clerkUser?.lastName &&
      data.username === clerkUser?.username
    ) {
      if (data.bio !== user?.bio) {
        updateUser({ bio: data.bio });
      }

      toggleEditing();
      return;
    }

    // update clerk user data
    try {
      const dataToUpdate = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
      };
      await clerkUser?.update(dataToUpdate);
      updateUser(data);

      toggleEditing();
    } catch (error) {
      console.error('Can not update data:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="first-name" className="text-gray-400">
            First name
          </label>
          <Error error={errors.firstName} />
          <input
            {...register('firstName')}
            type="text"
            id="first-name"
            defaultValue={user?.firstName || ''}
            className="rounded border border-solid border-gray-400 p-1 px-2 focus:outline-black"
            maxLength={35}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="last-name" className="text-gray-400">
            Last name
          </label>
          <Error error={errors.lastName} />
          <input
            {...register('lastName')}
            type="text"
            id="last-name"
            defaultValue={user?.lastName || ''}
            className="rounded border border-solid border-gray-400 p-1 px-2 focus:outline-black"
            maxLength={35}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-gray-400">
            Username
          </label>
          <Error error={errors.username} />
          <input
            {...register('username')}
            type="text"
            id="username"
            defaultValue={user?.username || ''}
            className="rounded border border-solid border-gray-400 p-1 px-2 focus:outline-black"
            maxLength={35}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="bio" className="text-gray-400">
            Bio
          </label>
          <Error error={errors.bio} />
          <textarea
            {...register('bio')}
            id="bio"
            defaultValue={user?.bio || ''}
            rows={4}
            className="rounded border border-solid border-gray-400 p-1 px-2 focus:outline-black"
            maxLength={200}
          />
        </div>
      </div>

      <div className="flex gap-4 font-medium text-white max-md:justify-center">
        <div className="flex max-w-40 flex-1">
          <button
            type="reset"
            className="w-full rounded bg-rose-500 px-4 py-2 transition-all ease-in hover:bg-rose-600 active:scale-95"
            disabled={isSubmitting}
            onClick={toggleEditing}
          >
            Cancel
          </button>
        </div>
        <div className="flex max-w-40 flex-1">
          <button
            type="submit"
            className="w-full rounded bg-emerald-400 px-4 py-2 transition-all ease-in hover:bg-emerald-600 active:scale-95"
            disabled={isSubmitting}
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default UserAboutForm;
