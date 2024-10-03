'use client'
import Node from '@/components/node'
import { useCallback, useLayoutEffect, useState } from 'react'
import { tTermin } from '@/lib/types'
import { Get } from '@/app/actions'
import { fastHeaders } from '@/lib/stag'

const fetchTerminyData = async () => {
 try {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/terminy`)
  url.searchParams.set('t', 'vypsane')
  const cookie = await Get('stagUserTicket')
  if (cookie) {
   url.searchParams.set('ticket', cookie.value)
  }
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (res.status != 200) {
   window.location.href = '/logout'
  } else if (res.status == 200) {
   return await res.json()
  }
 } catch {
  window.location.href = '/logout'
 }
}

export default function VypsaneTerminy({ typ }: { typ: string | undefined }) {
 const [Terminy, setTerminy] = useState<tTermin[]>([])

 const [reload, setReload] = useState<boolean>(false)

 const fetchTerminy = useCallback(async () => {
  const data = await fetchTerminyData()
  if (data) {
   setTerminy(data.data)
   setReload(false)
  }
 }, [reload])

 useLayoutEffect(() => {
  fetchTerminy()
 }, [reload])

 if (Terminy?.length === 0) {
  return <div>Loading...</div>
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
