import React from 'react'
import NavbarComponent from './navbar'
import Vytvor from '@/modules/vytvor'

export default function RootLayout({
 children,
 params,
}: {
 children: React.ReactNode
 params: { slug: string }
}) {
 return (
  <>
   <NavbarComponent id={params.slug} />
   <>{children}</>
   <Vytvor />
  </>
 )
}
