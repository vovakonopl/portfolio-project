import type { Metadata } from 'next';
import ProfileNav from './_components/profile-navbar';

export const metadata: Metadata = {
  title: 'Trinket | Profile',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="profile container flex flex-1">
      <ProfileNav />

      <main className="w-full py-3 pl-8 pr-4 max-md:px-4 max-sm:px-0">
        {children}
      </main>
    </div>
  );
}
