'use client'
import Node from '@/components/node'
import { useCallback, useLayoutEffect, useState } from 'react'
import { tTermin } from '@/lib/types'
import { Get } from '@/app/actions'
import { fastHeaders } from '@/lib/stag'
import { Skeleton } from '@/components/ui/skeleton'
import { useSearchParams } from 'next/navigation'

const fetchTerminyData = async (vybrane: string) => {
 try {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/filtr`)
  url.searchParams.set('vybrane', vybrane)
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

 const [reload, setReload] = useState<boolean>(false)
 const [fetching, setFetching] = useState<boolean>(true)

 const searchParams = useSearchParams()

 const fetchTerminy = useCallback(async () => {
  const vybrane = searchParams.get('s')
  const data = await fetchTerminyData(vybrane || '')
  if (data) {
   setTerminy(data.data)
   setReload(false)
  }

  setFetching(false)
 }, [searchParams])

 useLayoutEffect(() => {
  fetchTerminy()
 }, [reload, fetchTerminy])

 if (Terminy?.length === 0 && fetching) {
  return (
   <div className="w-max h-[10rem] grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-3">
    {Array.from({ length: 3 }, (_, index) => (
     <Skeleton
      key={index}
      className="w-[25rem] h-[18rem] rounded-xl border-1 border-gray-700 bg-gradient-to-tr from-black to-gray-800"
     />
    ))}
   </div>
  )
 } else if (!fetching && Terminy?.length === 0) {
  return <h2 className="text-xl text-white font-bold"> Nebyl nalezen žádný termín</h2>
 }

 return (
  <>
   <div className="w-max grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-3">
    {Terminy?.map((termin: tTermin) => (
     <Node key={termin._id} owned={false} {...termin} typ={typ || ''} setReload={setReload} />
    ))}
   </div>
  </>
 )
}
