import { Unauthorized, NotFound, Success, Internal } from '@/lib/http'
import { formatTime, setupParser } from '@/lib/parsers'
import { fastHeaders, GetTicket } from '@/lib/stag'
import { tStudent, tTermin, tTerminBody } from '@/lib/types'

// Create
export async function POST(req: Request) {
 const rTicket = GetTicket(req)
 if (!rTicket) return Unauthorized()

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

 const body: tTermin = await req.json()
 if (!body) {
  return NotFound()
 }
 const fBody = {
  ucebna: body.ucebna,
  datum_start: body.start,
  datum_konec: body.konec,
  max_kapacita: body.kapacita,
  cislo_cviceni: body.cviceni,
  popis: body.tema,
  jmeno: body.nazev,
  kod_predmetu: body._id,
  upozornit: null,
  vyucuje_prijmeni: null,
 }
 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/ucitel/termin`)
 url.searchParams.set('ticket', rTicket)
 const res = await fetch(url.toString(), {
  method: 'POST',
  headers: fastHeaders,
  body: JSON.stringify(fBody),
 })
 if (!res.ok) {
  return Internal()
 }
 return Success()
}

// Read
export async function GET(req: Request) {
 const rTicket = GetTicket(req)
 if (!rTicket) return Unauthorized()

 const base = new URL(req.url)
 const rID = base.searchParams.get('id') || ''

 if (!rID) {
  return NotFound()
 }

 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/ucitel/termin`)
 url.searchParams.set('ticket', rTicket)
 url.searchParams.set('id_terminu', rID)

 const res = await fetch(url.toString(), {
  method: 'GET',
  headers: fastHeaders,
 })

 if (!res.ok) {
  if (res.status == 404) return NotFound()
  else return Internal()
 }

 let data = await res.json()

 const studenti: tStudent[] = data.studenti
 data = data.termin
 const termin: tTermin = {
  _id: data.kod_predmet,
  ucebna: data.ucebna,
  start: data.datum_start,
  konec: data.datum_konec,
  nazev: data.jmeno,
  cviceni: data.cislo_cviceni,
  zapsany: data.aktualni_kapacita,
  kapacita: data.max_kapacita,
  tema: data.popis,
 }
 return Success({ termin: termin, studenti: studenti })
}

// Update
export async function PATCH(req: Request) {}

// Delete
export async function DELETE(req: Request) {
 const rTicket = GetTicket(req)
 if (!rTicket) return Unauthorized()

 const base = new URL(req.url)
 const rID = base.searchParams.get('id') || ''

 if (!rID) {
  return NotFound()
 }

 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/ucitel/termin`)
 url.searchParams.set('ticket', rTicket)
 url.searchParams.set('id_terminu', rID)

 const res = await fetch(url.toString(), {
  method: 'DELETE',
  headers: fastHeaders,
 })
 if (!res.ok) {
  return Internal()
 }
 return Success()
}
