import React from 'react'
import { NavbarStudent as Navbar } from '@/components/navbars'
import { Toaster } from '@/components/ui/toaster'

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
   <main className="max-w-4xl mx-auto">{children}</main>
   <Toaster />
  </>
 )
}
