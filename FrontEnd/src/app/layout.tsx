import type { Metadata } from 'next'
import { GeistSans } from 'geist/font'
import '../sass/index.scss';

import './globals.css';
//import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Laborky UJEP',
  description: 'UJEP.cz Laborky',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
          {children}
      </body>
    </html>
  )
}
