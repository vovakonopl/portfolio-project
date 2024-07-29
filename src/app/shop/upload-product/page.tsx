import { FC } from 'react';
import NewProductForm from './_components/form';

interface INewProductProps {}

const NewProduct: FC<INewProductProps> = () => {
  return (
    <div className="container">
      <main className="flex flex-col items-center">
        <h1>Create a new product</h1>
        <NewProductForm />
      </main>
    </div>
  );
};

export default NewProduct;
