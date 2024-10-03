import { Terminy } from '@/data/terminy'
import { Unauthorized, Success, Conflict, NotFound } from '@/lib/http'
import { tTermin } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
 const base = new URL(req.url)
 const rID = base.searchParams.get('id') || ''
 const rTicket = base.searchParams.get('ticket') || ''
 const rType = base.searchParams.get('type') || ''

 if (!rTicket) {
  return Unauthorized
 }
 if (!rID || !rType) {
  return NotFound
 }

 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/student`)
 url.searchParams.set('id_terminu', rID)
 url.searchParams.set('typ', rType)
 url.searchParams.set('ticket', rTicket)
}
