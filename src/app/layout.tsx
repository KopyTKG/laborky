import type { Metadata } from 'next'
import { GeistSans } from 'geist/font'
import '../sass/index.scss';
import {NextUIProvider} from "@nextui-org/react";


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
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </body>
    </html>
  )
}
