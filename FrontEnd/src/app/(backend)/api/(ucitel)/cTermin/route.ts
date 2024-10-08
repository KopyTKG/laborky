import { Unauthorized, NotFound, Success, Internal } from '@/lib/http'
import { formatTime, setupParser } from '@/lib/parsers'
import { fastHeaders } from '@/lib/stag'
import { tTermin, tTerminBody } from '@/lib/types'

export async function POST(req: Request) {
 const base = new URL(req.url)
 const rTicket = base.searchParams.get('ticket') || ''

 if (!rTicket) {
  return Unauthorized()
 }

 const checkURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/setup`)
 checkURL.searchParams.set('ticket', rTicket)
 const roleRes = await fetch(checkURL.toString(), { method: 'GET', headers: fastHeaders })

 if (!roleRes.ok) {
  return Unauthorized()
 }

 const data = await roleRes.json()
 const info = setupParser(data)

 if (info.role == 'ST') {
  return Unauthorized()
 }

 const body: tTerminBody = await req.json()
 if (!body) {
  return NotFound()
 }
 const fBody = {
  ucebna: body.ucebna,
  datum_start: `${body.datum}T${formatTime(body.start)}.000Z`,
  datum_konec: `${body.datum}T${formatTime(body.end)}.000Z`,
  max_kapacita: body.kapacita,
  cislo_cviceni: body.cviceni,
  popis: body.tema,
  jmeno: body.predmet._id,
  kod_predmetu: body.predmet._id,
  upozornit: false,
  vyucuje_prijmeni: '',
 }
 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/ucitel/termin`)
 url.searchParams.set('ticket', rTicket)
 const res = await fetch(url.toString(), {
  method: 'POST',
  headers: fastHeaders,
  body: JSON.stringify(fBody),
 })
 console.log(fBody)
 if (!res.ok) {
  return Internal()
 }
 console.log(res)
 return Success()
}
