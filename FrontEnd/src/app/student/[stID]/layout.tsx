import React from 'react'
import { NavbarStudent as Navbar } from '@/components/navbars'
import ReloadProvider from '@/contexts/ReloadProvider'

export default function RootLayout({
 children,
 params,
}: {
 children: React.ReactNode
 params: { stID: string }
}) {
 return (
  <>
   <Navbar id={params.stID} />
   <ReloadProvider>
    <main className="max-w-4xl mx-auto pt-20">{children}</main>
   </ReloadProvider>
  </>
 )
}
