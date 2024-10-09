import React from 'react'
import { NavbarTeacher as Navbar } from '@/components/navbars'
import Vytvor from '@/components/vytvor'
import ReloadProvider from '@/components/ReloadProvider'

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
   <ReloadProvider>
    <main className="max-w-4xl mx-auto">{children}</main>
    <Vytvor />
   </ReloadProvider>
  </>
 )
}
