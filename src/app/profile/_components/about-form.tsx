import { FC } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type TUserAboutScheme,
  userAboutScheme,
} from '@/scripts/validation-schemes/profile/user-about-scheme';
import { useTrinketUser } from '@/scripts/user';
import InputField from '@/components/ui/text-input-field';

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
        <InputField
          register={register('firstName')}
          id="first-name"
          defaultValue={user?.firstName || ''}
          type="text"
          maxLength={35}
          label="First name"
          error={errors.firstName}
          fullWidth
        />

        <InputField
          register={register('lastName')}
          id="last-name"
          defaultValue={user?.lastName || ''}
          type="text"
          maxLength={35}
          label="Last name"
          error={errors.lastName}
          fullWidth
        />

        <InputField
          register={register('username')}
          id="username"
          defaultValue={user?.username || ''}
          type="text"
          maxLength={35}
          label="Username"
          error={errors.username}
          fullWidth
        />

        <InputField
          register={register('bio')}
          id="bio"
          defaultValue={user?.bio || ''}
          maxLength={200}
          component="textarea"
          label="Bio"
          error={errors.bio}
          fullWidth
          rows={4}
        />
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
