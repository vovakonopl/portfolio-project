import { useTrinketUser } from '@/scripts/user';
import { FC, useEffect, useRef, useState, MouseEvent } from 'react';
import { ExternalAccountResource } from '@clerk/types/dist/index';
import Modal from '@/components/modal';

interface IExternalAccountProps {
  provider: 'google' | 'facebook' | 'apple';
  children: React.ReactNode;
}

const ExternalAccount: FC<IExternalAccountProps> = ({ provider, children }) => {
  const { clerkUser } = useTrinketUser();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [extAccount, setExtAccount] = useState<ExternalAccountResource | null>(
    null,
  );
  const closeModalRef = useRef<() => void>(() => {});

  useEffect(() => {
    const extAccount: ExternalAccountResource | undefined =
      clerkUser?.externalAccounts.find(
        (account) =>
          account.provider == provider &&
          account.verification?.status === 'verified',
      );

    setExtAccount(extAccount || null);
  }, [clerkUser, provider]);

  if (!clerkUser) {
    return <></>;
  }

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    closeModalRef.current();
  };

  const handleLink = async () => {
    const extAccount = await clerkUser.createExternalAccount({
      strategy: `oauth_${provider}`,
      redirectUrl: '/profile',
    });

    const verificationUrl =
      extAccount.verification?.externalVerificationRedirectURL;

    if (!verificationUrl) return;

    window.location.href = verificationUrl.href;
  };

  const handleUnlink = (e: MouseEvent) => {
    const currentButton = e.target as HTMLButtonElement;
    currentButton.disabled = true;

    extAccount?.destroy();
    closeModal();
  };

  return (
    <div className="flex items-end gap-2">
      <button
        onClick={extAccount ? openModal : handleLink}
        className="flex min-w-28 items-center text-lg font-medium underline-offset-2 transition-opacity hover:underline active:opacity-70"
      >
        {children}
      </button>
      <p className="text-sm text-gray-400">
        {extAccount ? '(Linked)' : '(Not linked)'}
      </p>

      {isModalOpen && (
        <Modal
          onClose={() => {
            setIsModalOpen(false);
          }}
          closeModalRef={closeModalRef}
          className="min-h-[15.75rem] w-11/12 max-w-[28rem] bg-white px-8"
        >
          <h3 className="mb-2 text-center text-lg font-medium">
            Are you sure you want to remove this account link?
          </h3>
          <div className="mt-auto flex gap-4">
            <button
              onClick={handleUnlink}
              className="flex-1 rounded bg-emerald-500 px-2 py-2 font-medium text-white"
            >
              Remove the link
            </button>
            <button
              onClick={closeModal}
              className="flex-1 rounded bg-rose-500 px-2 py-2 font-medium text-white"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExternalAccount;
