import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../sass/index.scss';
import {AuthWrapper} from '@/modules/auth.provider';

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  )
}
