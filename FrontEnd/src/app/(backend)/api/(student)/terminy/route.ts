import { Terminy, Moje } from '@/data/terminy'
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

 if (!rType || (rType != 'vypsane' && rType != 'zapsane')) {
  return NotFound
 } else if (rType === 'vypsane') {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/student`)
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
 } else {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/student/moje`)
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
