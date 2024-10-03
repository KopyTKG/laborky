'use client'
import { Get } from '@/app/actions'
import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'
import { tPredmet } from '@/lib/types'
import { useLayoutEffect, useState } from 'react'

export default function Profil() {
 const [predmety, setPredmety] = useState<tPredmet[]>([] as tPredmet[])
 useLayoutEffect(() => {
  const fetchPredmety = async () => {
   try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/profil`)
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
     setPredmety(jsonParsed.data as tPredmet[])
    }
   } catch {
    window.location.href = '/logout'
   }
  }
  fetchPredmety()
 }, [])

 return (
  <>
   <div className="w-full">
    {predmety.map((predmet: tPredmet) => {
     return (
      <div className="mb-3" key={predmet.nazev}>
       <h3 className="font-bold text-2xl">{predmet.nazev}</h3>
       <div className="w-full h-max p-2 bg-zinc-800 rounded flex flex-col gap-1">
        {predmet.cviceni.map((datum: any, key: number) => {
         return (
          <div key={datum.toLocaleString() + key} className="flex flex-row justify-between">
           <span>{`Laboratorní cvičení ${key + 1}`}</span>
           <Badge variant={datum ? 'success' : 'danger'}>
            {
             datum
              ? 'splnil'
              : 'nesplnil' /*datum ? new Date(datum).toLocaleDateString() : 'nesplnil'*/
            }
           </Badge>
          </div>
         )
        })}
       </div>
       <Divider />
      </div>
     )
    })}
   </div>
  </>
 )
}
