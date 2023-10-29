import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../sass/index.scss';

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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
