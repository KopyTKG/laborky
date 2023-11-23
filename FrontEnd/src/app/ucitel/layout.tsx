import React from 'react'
import NavbarComponent from './navbar'
import Vytvor from '@/modules/overlay/vytvor'

export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
  <>
   <NavbarComponent />
   <>{children}</>
   <Vytvor />
  </>
 )
}
