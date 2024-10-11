// app/providers.tsx
'use client'
import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from "next-themes/dist/types"
import { NextUIProvider } from '@nextui-org/react'
import { Toaster } from '@/components/ui/toaster'

export function Providers({ children, ...props }: ThemeProviderProps) {
 return (
  <NextThemesProvider {...props}>
   <NextUIProvider>
    <Toaster />
    {children}
   </NextUIProvider>
  </NextThemesProvider>
 )
}
