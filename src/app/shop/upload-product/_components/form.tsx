'use client';

import Dropzone from '@/components/util-components/dropzone';
import InputField from '@/components/util-components/input-field';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

interface INewProductFormProps {}

const NewProductForm: FC<INewProductFormProps> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  return (
    <form className="w-full max-w-lg">
      <InputField
        id="name"
        type="text"
        label="Name"
        placeholder="My product"
        fullWidth
      />

      <InputField
        id="price"
        type="number"
        label="Price"
        placeholder="1.00$"
        fullWidth
      />

      <div>
        <Dropzone />
      </div>

      <InputField
        id="desription"
        component="textarea"
        label="Description"
        placeholder="About product"
        fullWidth
      />
    </form>
  );
};

export default NewProductForm;
