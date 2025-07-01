import { FC, RefObject, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  serviceScheme,
  TService,
} from '@/scripts/validation-schemes/product-upload/service-scheme';
import Image from 'next/image';
import Modal from '@/components/modal';
import InputField from '@/components/ui/text-input-field';
import ImageDropzone from '@/components/ui/dropzone';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import ModalButtons from '@/app/shop/upload-product/_components/modal-buttons';
import { AdditionalService } from '@/app/shop/upload-product/_utils/structures/additional-service';

interface IServiceModalProps {
  closeModalRef: RefObject<() => void>;
  initialValues?: AdditionalService;
  onClose: () => void;
  onSubmit: (service: AdditionalService) => void;
}

const ServiceModal: FC<IServiceModalProps> = ({
  closeModalRef,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const [image, setImage] = useState<File | undefined>(initialValues?.image);
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm<TService>({
    resolver: zodResolver(serviceScheme),
    defaultValues: initialValues,
  });

  useEffect(() => {
    const { unsubscribe } = watch((value, { name }) => {
      if (name === 'image') {
        setImage(value[name] as File | undefined);
      }
    });

    return unsubscribe;
  }, [watch]);

  const removeImage = () => {
    setValue('image', undefined);
  };

  const submit = (data: TService) => {
    const service = new AdditionalService(
      data.name,
      data.price,
      data.description,
      data.image,
    );

    onSubmit(service);
    closeModalRef.current();
  };

  return (
    <Modal onClose={onClose} closeModalRef={closeModalRef}>
      <h3 className="text-center text-xl font-medium">Additional service</h3>
      <InputField
        id="service-name"
        label="Name*"
        register={register('name')}
        error={errors.name}
        maxLength={50}
        fullWidth
      />
      <InputField
        id="service-price"
        label="Price*"
        register={register('price')}
        error={errors.price}
        fullWidth
      />
      <InputField
        id="service-description"
        component="textarea"
        label="Description"
        register={register('description')}
        error={errors.description}
        fullWidth
        className="h-28"
      />

      {!image && (
        <Controller
          control={control}
          name="image"
          render={({ field: { onChange } }) => (
            <ImageDropzone
              onChange={(images: File[]) => onChange(images[0] || null)}
              errorMessage={errors.image?.message}
              id="image"
              name="image"
              className="h-24"
            />
          )}
        />
      )}
      {image && (
        <div className="mt-2 flex h-24 select-none items-center justify-center gap-2">
          <Image
            alt=""
            className="size-full max-w-24 rounded-xl object-cover"
            src={URL.createObjectURL(image)}
            width={100}
            height={100}
          />
          <button
            className={cn(
              'flex items-center gap-1 rounded border border-gray-400',
              'bg-black bg-opacity-0 px-2 py-1 hover:bg-opacity-5',
              'focus:bg-opacity-5 active:bg-opacity-10',
            )}
            type="button"
            onClick={removeImage}
          >
            <span>Remove</span>
            <X className="mt-1 size-4 text-black" />
          </button>
        </div>
      )}

      <ModalButtons
        className="mt-2"
        handleCancel={closeModalRef.current}
        handleConfirm={handleSubmit(submit)}
      />
    </Modal>
  );
};

export default ServiceModal;
