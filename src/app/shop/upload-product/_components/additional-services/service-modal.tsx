import { FC, RefObject, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import {
  serviceScheme,
  TService,
} from '@/scripts/validation-schemes/product-upload/service-scheme';
import Image from 'next/image';
import Modal from '@/components/modal';
import InputField from '@/components/ui/text-input-field';
import ImageDropzone from '@/components/ui/dropzone';
import { cn } from '@/lib/cn';
import { AdditionalService } from '@/types/product/additional-service';
import ModalButtons from '@/app/shop/upload-product/_components/modal-buttons';
import { PRODUCT_FIELDS_LIMITS } from '@/constants/product/product-fields-limits';

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
        error={errors.name}
        fullWidth
        label="Name*"
        maxLength={PRODUCT_FIELDS_LIMITS.service.nameLength}
        register={register('name')}
      />
      <InputField
        id="service-price"
        error={errors.price}
        fullWidth
        label="Price*"
        max={PRODUCT_FIELDS_LIMITS.maxPrice}
        register={register('price')}
      />
      <InputField
        id="service-description"
        className="h-28"
        component="textarea"
        error={errors.description}
        fullWidth
        label="Description"
        maxLength={PRODUCT_FIELDS_LIMITS.service.descriptionLength}
        register={register('description')}
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
