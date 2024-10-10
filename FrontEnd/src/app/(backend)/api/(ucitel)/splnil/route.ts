import { Unauthorized, NotFound, Success, Internal } from '@/lib/http'
import { setupParser } from '@/lib/parsers'
import { fastHeaders, GetTicket } from '@/lib/stag'

// Create
export async function GET(req: Request) {
 const rTicket = GetTicket(req)
 if (!rTicket) return Unauthorized()
 const base = new URL(req.url)
 const rId_stud = base.searchParams.get('id_stud') || ''
 const rId_terminu = base.searchParams.get('id_terminu') || ''

 if (!rId_stud || !rId_terminu) return NotFound()

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

 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/ucitel/splneno`)
 url.searchParams.set('ticket', rTicket)
 url.searchParams.set('id_stud', rId_stud)
 url.searchParams.set('id_terminu', rId_terminu)

 const res = await fetch(url.toString(), {
  method: 'POST',
  headers: fastHeaders,
 })
 if (!res.ok) {
  return Internal()
 }
 return Success()
}