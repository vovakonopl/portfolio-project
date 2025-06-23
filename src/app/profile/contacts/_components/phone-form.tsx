import { useTrinketUser } from '@/scripts/user';
import {
  phoneScheme,
  TPhone,
} from '@/scripts/validation-schemes/profile/phone-scheme';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Modal from '@/components/modal';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface IPhoneFormProps {
  closeModal: () => void;
}

const PhoneForm: FC<IPhoneFormProps> = ({ closeModal }) => {
  const { user, updateUser } = useTrinketUser();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<TPhone>({
    resolver: zodResolver(phoneScheme),
  });
  const closeModalRef = useRef<() => void>(() => {});

  const onSubmit = (data: TPhone) => {
    if (user!.phoneNumbers.length >= 3) {
      closeModalRef.current();
      return;
    }

    updateUser({
      phoneNumbers: [...user!.phoneNumbers, `+${data.phoneNumber}`],
    });

    closeModalRef.current();
  };

  return (
    <Modal
      backdropClassName="max-sm:bg-opacity-0"
      onClose={closeModal}
      closeModalRef={closeModalRef}
    >
      <h2 className="mb-2 text-center text-xl">Adding phone number</h2>
      <form
        className="flex flex-1 flex-col max-sm:max-h-72"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="phone-number" className="mb-1 text-lg text-gray-400">
          Enter your phone number
        </label>
        <Controller
          name="phoneNumber"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <PhoneInput
              country={'ua'}
              placeholder="+380 (00) 000 00 00"
              onChange={onChange}
              value={value}
              inputProps={{
                id: 'phone-number',
                className:
                  'relative my-0 box-border max-w-80 flex-1 rounded border border-gray-200 bg-white py-1 pl-12 text-lg focus:outline-offset-2 focus:outline-black',
              }}
              containerClass="flex"
            />
          )}
        />
        <p className="text-red-600">{errors.phoneNumber?.message}</p>
        <div className="mt-auto flex flex-col">
          <button
            disabled={isSubmitting}
            className="rounded border-gray-200 bg-black px-4 py-2 text-white transition-all ease-in hover:bg-opacity-80 active:scale-95 active:bg-opacity-100 sm:w-40"
          >
            Submit
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PhoneForm;
