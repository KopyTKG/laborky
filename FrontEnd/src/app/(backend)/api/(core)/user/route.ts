import { Success, Unauthorized } from '@/lib/http'
import { fastHeaders } from '@/lib/stag'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
 const url = new URL(req.url)
 const rTicket = url.searchParams.get('ticket') || ''

 if (!rTicket) {
  return Unauthorized
 } else {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/setup`)
  url.searchParams.set('ticket', rTicket)
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })

  if (!res.ok) {
   return Unauthorized
  }

  return Success
 }
}
