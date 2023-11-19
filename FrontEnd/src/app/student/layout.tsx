import React from 'react'
import NavbarComponent from './navbar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
  <>
   <NavbarComponent />
   <>{children}</>
  </>
 )
}
