'use client'
import Node from '@/components/node'
import { useCallback, useContext, useLayoutEffect, useState } from 'react'
import { tTermin } from '@/lib/types'
import { Get } from '@/app/actions'
import { fastHeaders } from '@/lib/stag'
import { Skeleton } from '@/components/ui/skeleton'
import { ReloadCtx } from '@/contexts/ReloadProvider'
import { Header } from '@/components/ui/header'

const fetchTerminyData = async () => {
 try {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/terminy`)
  url.searchParams.set('t', 'vypsane')
  const cookie = await Get('stagUserTicket')
  if (cookie) {
   url.searchParams.set('ticket', cookie.value)
  }
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (res.status == 401) {
   window.location.href = '/logout'
  } else if (res.status == 200 || res.status == 404) {
   return await res.json()
  }
 } catch (e) {
  console.error(e)
 }
}

export default function VypsaneTerminy({ typ }: { typ: string | undefined }) {
 const [Terminy, setTerminy] = useState<tTermin[]>([])

 const [fetching, setFetching] = useState<boolean>(true)

 const context = useContext(ReloadCtx)

 if (!context) {
  throw new Error('Missing ReloadProvider')
 }

 // Destructure the context values
 const [reload, setReload] = context

 const fetchTerminy = useCallback(async () => {
  const data = await fetchTerminyData()
  if (data) {
   setTerminy(data.data)
   console.log(data.data)
   setReload(false)
  }
  setFetching(false)
 }, [reload])

 useLayoutEffect(() => {
  fetchTerminy()
 }, [reload])

 if (Terminy?.length === 0 && fetching) {
  return (
   <div className="w-max h-[10rem] grid grid-cols-1 lg:grid-cols-2 grid-flow-row gap-3">
    {Array.from({ length: 3 }, (_, index) => (
     <Skeleton key={index} className="w-[25rem] h-[18rem] rounded-xl" />
    ))}
   </div>
  )
 }
 if (!fetching && Terminy?.length === 0) {
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
     <Node key={termin._id} owned={false} {...termin} typ={typ || ''} />
    ))}
   </div>
  </>
 )
}
