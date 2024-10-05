import { NotFound, Success, Unauthorized } from '@/lib/http'
import { fastHeaders } from '@/lib/stag'
import { tPredmet } from '@/lib/types'

export async function GET(req: Request) {
 const base = new URL(req.url)
 const rTicket = base.searchParams.get('ticket') || ''

 if (!rTicket) {
  return Unauthorized()
 }
 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/profil`)
 url.searchParams.set('ticket', rTicket)

 const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
 if (!res.ok) {
  return NotFound()
 }
 const data = (await res.json()) as { [key: string]: number[] }
 const keys = Object.keys(data)
 const parsed: tPredmet[] = []
 keys.forEach((item: string) => {
  let tmp: tPredmet = {
   nazev: item,
   cviceni: data[item],
  }
  parsed.push(tmp)
 })

 return Success({ data: parsed })
}
