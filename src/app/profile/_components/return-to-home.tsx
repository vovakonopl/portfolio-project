import { useRouter } from 'next/navigation';
import { FC } from 'react';

interface IToHomeProps {}

const ToHome: FC<IToHomeProps> = () => {
  const router = useRouter();
  router.replace('/');

  return <></>;
};

export default ToHome;

// this component is needed in case the clerk user obj was loaded, but the trinket user obj wasn't
