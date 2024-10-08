import { Unauthorized, NotFound, Success } from '@/lib/http'
import { setupParser } from '@/lib/parsers'
import { fastHeaders } from '@/lib/stag'
import { tTermin } from '@/lib/types'

export async function POST(req: Request) {
 const url = new URL(req.url)
 const rTicket = url.searchParams.get('ticket') || ''

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

 const body = await req.json()
 if (!body) {
  return NotFound()
 }
 console.log(body)
 return Success()
}
