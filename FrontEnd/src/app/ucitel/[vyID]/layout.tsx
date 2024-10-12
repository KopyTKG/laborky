import React from 'react'
import { NavbarTeacher as Navbar } from '@/components/navbars'
import { Vytvor } from '@/components/vytvor'
import ContextProviders from '@/contexts/providers'
import Formular from '@/components/formular'

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
   <ContextProviders>
    <main className="max-w-6xl mx-auto mt-20">{children}</main>
    <Vytvor />
    <Formular />
   </ContextProviders>
  </>
 )
}
