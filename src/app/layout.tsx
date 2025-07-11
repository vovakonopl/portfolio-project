import type { Metadata } from 'next';
import { Poppins, Rubik } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar/navbar';
import Footer from '@/components/footer';
import { ClerkProvider } from '@clerk/nextjs';
import UserProvider from '@/scripts/user';

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik',
  weight: ['400', '500', '700'],
});
const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: '700',
});

export const metadata: Metadata = {
  title: 'Trinket',
  description: 'Portfolio project',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${rubik.variable} ${poppins.variable} font-rubik`}>
          <UserProvider>
            <div className="relative flex min-h-dvh flex-col pb-footer-h pt-nav-h">
              <Navbar />
              {children}
              <Footer />
            </div>
          </UserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
