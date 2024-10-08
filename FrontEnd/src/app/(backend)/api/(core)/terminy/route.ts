import { Unauthorized, NotFound, Success } from '@/lib/http'
import { resTotTermin, setupParser } from '@/lib/parsers'
import { fastHeaders } from '@/lib/stag'
import { tTermin } from '@/lib/types'

export async function GET(req: Request) {
 const url = new URL(req.url)
 const rType = url.searchParams.get('t') || ''
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

 let apipoint = '/ucitel'
 if (info.role === 'ST') {
  apipoint = '/student'
 } else if (info.role === 'RE') {
  apipoint = '/admin'
 }

 if (!rType || (rType != 'vypsane' && rType != 'zapsane')) {
  return NotFound()
 } else if (rType === 'vypsane') {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}${apipoint}`)
  url.searchParams.set('ticket', rTicket)
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (!res.ok) {
   return NotFound()
  }
  const data = await res.json()
  const terminy: tTermin[] = resTotTermin(data)
  const sorted = terminy.sort((a, b) => new Date(a.end).getTime() - new Date(b.end).getTime())
  return Success({ data: sorted })
 } else {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}${apipoint}/moje`)
  url.searchParams.set('ticket', rTicket)
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (!res.ok) {
   return NotFound()
  }
  const data = await res.json()
  const terminy: tTermin[] = resTotTermin(data)
  const sorted = terminy.sort((a, b) => new Date(a.end).getTime() - new Date(b.end).getTime())
  return Success({ data: sorted })
 }
}
