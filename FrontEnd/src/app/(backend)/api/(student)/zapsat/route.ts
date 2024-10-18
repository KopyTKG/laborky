import { isStudent } from '@/lib/functions'
import { Unauthorized, Success, Conflict, NotFound, Internal, Forbidden } from '@/lib/http'
import { fastHeaders, getTicket, getUserInfo } from '@/lib/stag'

export async function GET(req: Request) {
 const rTicket = getTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (!isStudent(info)) return Forbidden()

 const base = new URL(req.url)
 const rID = base.searchParams.get('id') || ''
 const rType = base.searchParams.get('type') || ''

 if (!rID || !rType) return NotFound()

 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/student`)
 url.searchParams.set('id_terminu', rID)
 url.searchParams.set('typ', rType)
 url.searchParams.set('ticket', rTicket)

 const res = await fetch(url.toString(), { method: 'POST', headers: fastHeaders })

 switch (res.status) {
  case 200:
   return Success()
  case 409:
   return Conflict()
  case 401:
   return Unauthorized()
  default:
   return Internal()
 }
}
