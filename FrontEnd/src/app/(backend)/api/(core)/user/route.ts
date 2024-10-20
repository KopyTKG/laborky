import { isStudent } from '@/lib/functions'
import { Internal, Success, Unauthorized } from '@/lib/http'
import { fastHeaders, getTicket, getUserInfo } from '@/lib/stag'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
 const rTicket = getTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()

 if (isStudent(info)) return Success()
 else {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/reset/ucitel`)
  url.searchParams.set('ticket', rTicket)
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (!res.ok) {
   return Internal()
  } else {
   return Success()
  }
 }
}
