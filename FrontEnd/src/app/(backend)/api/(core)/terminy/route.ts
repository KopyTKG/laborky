import { Unauthorized, NotFound } from '@/lib/http'
import { fastHeaders } from '@/lib/stag'
import { tTermin } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
 const url = new URL(req.url)
 const rType = url.searchParams.get('t') || ''
 const rTicket = url.searchParams.get('ticket') || ''

 if (!rTicket) {
  return Unauthorized
 }

 const checkURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/setup`)
 checkURL.searchParams.set('ticket', rTicket)
 const roleRes = await fetch(checkURL.toString(), { method: 'GET', headers: fastHeaders })

 if (!roleRes.ok) {
  return Unauthorized
 }

 const role = await roleRes.json()

 //let apipoint = '/ucitel'
 //if (role === 'ST') {
 let apipoint = '/student'
 //}

 if (!rType || (rType != 'vypsane' && rType != 'zapsane')) {
  return NotFound
 } else if (rType === 'vypsane') {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}${apipoint}`)
  url.searchParams.set('ticket', rTicket)
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (!res.ok) {
   return NotFound
  }
  const data = await res.json()
  const terminy: tTermin[] = []
  data.forEach((item: any) => {
   let tmp: tTermin = {
    _id: item.id,
    location: item.ucebna,
    start: item.datum,
    end: item.datum,
    predmet: item.kod_predmet,
    cislo: item.cislo_cviceni,
    kapacita: item.max_kapacita,
    zapsany: item.aktualni_kapacita,
    vypsal: item.vyucuje_id,
   }
   terminy.push(tmp)
  })
  const sorted = terminy.sort((a, b) => new Date(a.end).getTime() - new Date(b.end).getTime())
  return Response.json({ data: sorted }, { status: 200 })
 } else {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}${apipoint}/moje`)
  url.searchParams.set('set', rTicket)
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (!res.ok) {
   return NotFound
  }
  const data = await res.json()
  const sorted = (data as tTermin[]).sort(
   (a, b) => new Date(a.end).getTime() - new Date(b.end).getTime(),
  )
  return Response.json({ data: sorted }, { status: 200 })
 }
}
