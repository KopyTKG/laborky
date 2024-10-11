import React from 'react'
import { NavbarTeacher as Navbar } from '@/components/navbars'
import Vytvor from '@/components/vytvor'
import ReloadProvider from '@/contexts/ReloadProvider'
import FilterProvider from '@/contexts/FilterProvider'

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
    <FilterProvider>
     <main className="max-w-4xl mx-auto mt-20">{children}</main>
     <Vytvor />
    </FilterProvider>
   </ReloadProvider>
  </>
 )
}
