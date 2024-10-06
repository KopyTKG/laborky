import React from 'react'
import { NavbarTeacher as Navbar } from '@/components/navbars'
import Vytvor from '@/components/vytvor'

export default function RootLayout({
 children,
 params,
}: {
 children: React.ReactNode
 params: { vyID: string }
}) {
 return (
  <>
   <Navbar id={params.vyID} />
   <main className="max-w-4xl mx-auto">{children}</main>
   <Vytvor />
  </>
 )
}
