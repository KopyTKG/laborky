'use client'
import Filtr from '@/components/filtr'
import FiltrTerminy from '@/components/user/FiltrTerminy'
import { tSelected } from '@/lib/types'

export default function Page({ searchParams }: { searchParams: tSelected }) {
 const selected = searchParams.s?.split('-') || []

 return (
  <div className="w-full grid grid-cols-5 gap-2">
   <Filtr search={selected} />
   <div className="col-span-4 col-start-2">
    <FiltrTerminy vybrane={selected.join('-')} />
   </div>
  </div>
 )
}
