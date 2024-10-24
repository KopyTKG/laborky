'use client'
import Node from '@/components/node'
import { useCallback, useContext, useLayoutEffect, useState } from 'react'
import { tTermin } from '@/lib/types'
import { Get } from '@/app/actions'
import { fastHeaders } from '@/lib/stag'
import { Skeleton } from '@/components/ui/skeleton'
import { FilterCtx } from '@/contexts/FilterProvider'
import { Header } from '@/components/ui/header'

const fetchTerminyData = async (data: string[], all: boolean) => {
 try {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/filtr`)
  url.searchParams.set('vybrane', data.join('-'))
  url.searchParams.set('vse', all? 'T' : 'F')
  const cookie = await Get('stagUserTicket')
  if (cookie) {
   url.searchParams.set('ticket', cookie.value)
  }
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (res.status == 401) {
   window.location.href = '/logout'
  } else if (res.status == 200) {
   return await res.json()
  }
 } catch (e) {
  console.error(e)
 }
}

export default function FiltrTerminy({ typ }: { typ?: string }) {
 const [Terminy, setTerminy] = useState<tTermin[]>([])

 const Fcontext = useContext(FilterCtx)
 if (!Fcontext) {
  throw new Error('Missing FilterProvider')
 }

 const {filter, all} = Fcontext

 const [fetching, setFetching] = useState<boolean>(true)

 const fetchTerminy = useCallback(async () => {
  const data = await fetchTerminyData(filter, all)
  if (data) {
   setTerminy(data.data)
  }

  setFetching(false)
 }, [filter])

 useLayoutEffect(() => {
  fetchTerminy()
 }, [fetchTerminy])

 if (Terminy?.length === 0 && fetching) {
  return (
   <div className="w-max grid grid-cols-1 lg:grid-cols-2 grid-flow-row gap-3 h-[10rem]">
    {Array.from({ length: 3 }, (_, index) => (
     <Skeleton key={index} className="w-[25rem] h-[18rem] rounded-xl" />
    ))}
   </div>
  )
 } else if (!fetching && Terminy?.length === 0) {
  return (
   <span className="grid grid-cols-1 lg:grid-cols-2 grid-flow-row gap-3">
    <Header type="h2" thickness="bold" className="col-span-2 w-[25rem] lg:w-[50.75rem] text-center">
     Nebyl nalezen žádný termín
    </Header>
   </span>
  )
 }

 return (
  <>
   <div className="w-max grid grid-cols-1 lg:grid-cols-2 grid-flow-row gap-3">
    {Terminy?.map((termin: tTermin) => (
     <Node key={termin._id} props={{...termin, typ: typ || ''}} />
    ))}
   </div>
  </>
 )
}
