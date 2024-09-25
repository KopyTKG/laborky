'use client'
import Node from '@/components/node'
import { useLayoutEffect, useState } from 'react'
import { tTermin } from '@/lib/types'
import { Get } from '@/app/actions'

export default function VypsaneTerminy() {
 const [Terminy, setTerminy] = useState<tTermin[]>([])

 useLayoutEffect(() => {
  const fetchTerminy = async () => {
   try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/terminy`)
    url.searchParams.set('t', 'vypsane')
    const cookie = await Get('stagUserTicket')
    if (cookie) {
     url.searchParams.set('ticket', cookie.value)
    }
    const headers = {
     Accept: 'application/json',
     'Content-Type': 'application/json',
     Connection: 'keep-alive',
     'Accept-Origin': `${process.env.NEXT_PUBLIC_BASE}`,
    }
    const res = await fetch(url.toString(), { method: 'GET', headers })
    if (res.status != 200) {
     window.location.href = '/logout'
    } else if (res.status == 200) {
     let jsonParsed = await res.json()
     setTerminy(jsonParsed.data)
    }
   } catch {
    window.location.href = '/logout'
   }
  }
  fetchTerminy()
 }, [])

 return (
  <>
   <div className="w-max grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-3">
    {Terminy.map((termin: tTermin) => (
     <Node key={termin._id} owned={false} {...termin} />
    ))}
   </div>
  </>
 )
}
