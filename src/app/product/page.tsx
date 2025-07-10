import { FC } from 'react';
import { redirect } from 'next/navigation';

interface IEmptyProductPageProps {}

// Should not be visited. Redirect user to home page.
const EmptyProductPage: FC<IEmptyProductPageProps> = () => {
  redirect('/');
};

export default EmptyProductPage;
