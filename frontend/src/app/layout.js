import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Winlytics — AI Cricket Prediction',
    template: '%s | Winlytics',
  },
  description: 'Predict the winning team of cricket matches using advanced AI and machine learning.',
  keywords: ['cricket', 'prediction', 'AI', 'machine learning', 'T20', 'ODI', 'Test'],
  openGraph: {
    title: 'Winlytics — AI Cricket Prediction',
    description: 'Predict the winning team of cricket matches using advanced AI and machine learning.',
    url: 'https://winlytics.vercel.app',
    siteName: 'Winlytics',
    images: [
      {
        url: 'https://winlytics.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Winlytics AI Cricket Prediction',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Winlytics — AI Cricket Prediction',
    description: 'Predict the winning team of cricket matches using advanced AI and machine learning.',
    images: ['https://winlytics.vercel.app/og-image.png'],
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
