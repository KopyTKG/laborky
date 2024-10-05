import { Unauthorized, Internal, Success } from '@/lib/http'
import { fastHeaders } from '@/lib/stag'
import { tPredmet } from '@/lib/types'

export async function GET(req: Request) {
 const base = new URL(req.url)
 const rTicket = base.searchParams.get('ticket') || ''

 if (!rTicket) {
  return Unauthorized()
 }

 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/predmety`)
 url.searchParams.set('ticket', rTicket)
 const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })

 if (!res.ok && res.status == 401) {
  return Unauthorized()
 } else if (!res.ok) {
  return Internal()
 } else {
  const data = await res.json()
  const predmety: tPredmet[] = []
  data.map((item: any, key: number) => {
   let predmet: tPredmet = {
    _id: key.toString(),
    nazev: item,
    nCviceni: key,
   }
   predmety.push(predmet)
  })

  return Success({ predmety })
 }
}
