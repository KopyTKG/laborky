import { Terminy } from '@/data/terminy'
import { Unauthorized, Success, Conflict, NotFound } from '@/lib/http'
import { tTermin } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
 const url = new URL(req.url)
 const rID = url.searchParams.get('id') || ''
 const rTicket = url.searchParams.get('ticket') || ''

 if (!rTicket) {
  return Unauthorized
 }
 if (!rID) {
  return NotFound
 }

 // API fetch
 //
 // tmp
 const termin = Terminy.find((a: tTermin) => a._id === rID)
 console.log(termin)
 if (!termin) {
  return NotFound
 } else {
  return Success
 }
}
