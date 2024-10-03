import { Unauthorized, Success, Conflict, NotFound, Internal } from '@/lib/http'
import { fastHeaders } from '@/lib/stag'

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

 const res = await fetch(url.toString(), { method: 'POST', headers: fastHeaders })

 switch (res.status) {
  case 200:
   return Success
  case 409:
   return Conflict
  case 401:
   return Unauthorized
  default:
   return Internal
 }
}
