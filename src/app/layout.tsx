import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BcmProvider } from '@/lib/store';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'BCM Navigator — Advisory & BIA Management System',
  description: 'Enterprise Business Continuity Management (BCM) and Business Impact Analysis (BIA) system aligned with ISO 22301 and ISO 22317.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B1F3A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="min-h-screen" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen font-sans bg-[#F4F6F8] text-slate-900 antialiased selection:bg-cyan-100 selection:text-cyan-900 overflow-y-auto"
        suppressHydrationWarning
      >
        <BcmProvider>
          <AppShell>{children}</AppShell>
        </BcmProvider>
      </body>
    </html>
  );
}
