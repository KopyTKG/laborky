import * as React from 'react'
import ReloadProvider from '@/contexts/ReloadProvider'
import FilterProvider from '@/contexts/FilterProvider'
import FormProvider from '@/contexts/FormProvider'

export default function ContextProviders({ children }: { children: React.ReactNode }) {
 return (
  <>
   <ReloadProvider>
    <FormProvider>
     <FilterProvider>{children}</FilterProvider>
    </FormProvider>
   </ReloadProvider>
  </>
 )
}
