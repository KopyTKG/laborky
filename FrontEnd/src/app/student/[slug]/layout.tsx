import React from 'react'
import NavbarComponent from './navbar'

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
  </>
 )
}
