import React from 'react'
import { NavbarTeacher as Navbar } from '@/components/navbars'
import Vytvor from '@/modules/vytvor'

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
   <>{children}</>
   <Vytvor />
  </>
 )
}
