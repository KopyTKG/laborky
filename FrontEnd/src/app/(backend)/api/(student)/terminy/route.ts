import { Terminy, Moje } from '@/data/terminy'
import { Unauthorized, NotFound } from '@/lib/http'
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
  // FAST API -- dummy data
  const sorted = (Terminy as tTermin[]).sort(
   (a, b) => new Date(a.end).getTime() - new Date(b.end).getTime(),
  )
  return Response.json({ data: sorted }, { status: 200 })
 } else {
  // FAST API -- dummy data
  return Response.json({ data: Moje }, { status: 200 })
 }
}
