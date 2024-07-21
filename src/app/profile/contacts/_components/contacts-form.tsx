import Modal from '@/components/modal';
import { useTrinketUser } from '@/scripts/user';
import { FC, useRef, ClipboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  contactScheme,
  TContact,
} from '@/scripts/validation-schemes/contact-scheme';

interface IContactFormProps {
  closeModal: () => void;
}

const ContactForm: FC<IContactFormProps> = ({ closeModal }) => {
  const { user, updateContacts } = useTrinketUser();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
  } = useForm<TContact>({
    resolver: zodResolver(contactScheme),
  });
  const closeModalRef = useRef<() => void>(() => {});

  const onSubmit = async (data: TContact) => {
    if (user!.additionalContacts.length >= 6) {
      closeModalRef.current();
      return;
    }

    await updateContacts({ method: 'POST', ...data });

    closeModalRef.current();
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    // second input must be empty
    const urlInputValue = getValues('url');
    if (urlInputValue) return;

    // copied data must be a link
    const copiedText = e.clipboardData.getData('text');
    if (
      !copiedText.startsWith('http://') &&
      !copiedText.startsWith('https://')
    ) {
      return;
    }

    // if url input is empty and user pastes the link into the first input => move the copied data to the second input
    e.preventDefault();
    console.log(copiedText.length);
    setValue('url', copiedText, { shouldValidate: true });
  };

  return (
    <Modal
      backdropClassName="max-sm:bg-opacity-0"
      onClose={closeModal}
      closeModalRef={closeModalRef}
    >
      <h2 className="mb-2 text-center text-xl">Adding contact</h2>
      <form
        className="flex flex-1 flex-col max-sm:max-h-72"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-2 flex w-full flex-col">
          <label htmlFor="contact-body" className="text-lg text-gray-400">
            Contact<sup>*</sup>
          </label>
          <input
            {...register('body')}
            autoFocus
            id="contact-body"
            type="text"
            placeholder="My contact"
            onPaste={onPaste}
            className="w-full rounded border border-black px-2 py-1 focus:outline-black"
          />
          {errors.body && (
            <p className="mt-1 text-red-600">{errors.body.message}</p>
          )}
        </div>

        <div className="mb-2 flex w-full flex-col">
          <label htmlFor="contact-url" className="text-lg text-gray-400">
            URL
          </label>
          <input
            {...register('url')}
            id="contact-url"
            type="text"
            placeholder="https://..."
            className="w-full rounded border border-black px-2 py-1 focus:outline-black"
          />
          {errors.url && (
            <p className="mt-1 text-red-600">{errors.url.message}</p>
          )}
        </div>

        <div className="mt-auto flex flex-col">
          <button
            disabled={isSubmitting}
            className="rounded border-gray-200 bg-black px-4 py-2 text-white transition-all ease-in hover:bg-opacity-80 active:scale-95 active:bg-opacity-100 disabled:opacity-80 sm:w-40"
          >
            {isSubmitting ? 'Sibmitting' : 'Submit'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ContactForm;
