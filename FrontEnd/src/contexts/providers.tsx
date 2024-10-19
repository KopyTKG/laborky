import * as React from 'react'
import ReloadProvider from '@/contexts/ReloadProvider'
import FilterProvider from '@/contexts/FilterProvider'
import FormProvider from '@/contexts/FormProvider'
import AdminProvider from './AdminProvider'

export default async function ContextProviders({ children }: { children: React.ReactNode }) {
 return (
  <>
   <ReloadProvider>
    <FormProvider>
     <FilterProvider>
      <AdminProvider>{children}</AdminProvider>
     </FilterProvider>
    </FormProvider>
   </ReloadProvider>
  </>
 )
}
