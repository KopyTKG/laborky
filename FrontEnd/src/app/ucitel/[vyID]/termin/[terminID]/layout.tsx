import React from 'react'

export default function RootLayout({
 children,
 params,
}: {
 children: React.ReactNode
 params: { vyID: string }
}) {
 return (
  <>
   <main className="max-w-4xl mx-auto">{children}</main>
  </>
 )
}
