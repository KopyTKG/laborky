import { isAdmin, isStudent } from '@/lib/functions'
import { Internal, Success, Unauthorized } from '@/lib/http'
import { resTotTermin } from '@/lib/parsers'
import { fastHeaders, getTicket, getUserInfo } from '@/lib/stag'
import { tTermin } from '@/lib/types'

export async function GET(req: Request) {
 const rTicket = getTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()

 if (isStudent(info)) return Unauthorized()

 let apipoint = '/ucitel'
 if (isAdmin(info)) {
  apipoint = '/admin'
 }

 const base = new URL(req.url)
 const rVybrane = base.searchParams.get('vybrane') || ''
 let rVse = base.searchParams.get('vse') || ''
 if (!rVse) rVse = 'F'

 const all = rVse == 'T' ? 'true' : ''

 const url = new URL(
  `${process.env.NEXT_PUBLIC_API_URL}${apipoint}/${rVybrane ? 'board_by_predmet' : 'moje'}`,
 )
 url.searchParams.set('ticket', rTicket)
 if (rVybrane) url.searchParams.set('predmety', rVybrane.split('-').join(';'))
 url.searchParams.set('probehle', all)
 const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
 if (!res.ok) {
  return Internal()
 }

 const data = await res.json()
 const terminy = resTotTermin(data).sort((a: tTermin, b: tTermin) => {
  return new Date(a.start).valueOf() - new Date(b.start).valueOf()
 })

 return Success({ data: terminy })
}
