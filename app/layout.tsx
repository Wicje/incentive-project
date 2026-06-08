import type {Metadata} from 'next';
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import IdentityModal from '@/components/IdentityModal';
import ClientLayout from '@/components/ClientLayout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Agency OS',
  description: 'Frontend-only agency operating system integrating with Google Sheets and Cloudinary.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable}`}>
      <body className="bg-[#FAF9F6] text-stone-800 font-sans antialiased flex h-screen overflow-hidden" suppressHydrationWarning>
        <ClientLayout>
          <IdentityModal />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
