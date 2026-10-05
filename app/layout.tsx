import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './v3.css';
import './v4.css';
import './v5.css';
import './v6.css';
import './v7.css';
import './v8.css';
import './v9.css';
import './v10.css';
import './v11.css';
import './v12.css';
import './v13.css';
import './v14.css';
import './v15.css';
import './v16.css';
import './v17.css';
import './v18.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Beibei (Anna) Zhu — Graphic Designer',
  description: 'Independent graphic designer working across identity, image and print.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
