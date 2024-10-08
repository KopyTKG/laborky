// app/providers.tsx
'use client'
import React from 'react'
import { NextUIProvider } from '@nextui-org/react'
import { Toaster } from '@/components/ui/toaster'

export function Providers({ children }: { children: React.ReactNode }) {
 return (
  <NextUIProvider>
   <Toaster />
   {children}
  </NextUIProvider>
 )
}
