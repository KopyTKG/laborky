import { Success, Unauthorized } from '@/lib/http'
import { fastHeaders } from '@/lib/stag'

export async function GET(req: Request) {
 const base = new URL(req.url)
 const rTicket = base.searchParams.get('ticket') || ''
 const rVybrane = base.searchParams.get('vybrane') || ''

 if (!rTicket) {
  return Unauthorized()
 }

 const checkURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/setup`)
 checkURL.searchParams.set('ticket', rTicket)
 const roleRes = await fetch(checkURL.toString(), { method: 'GET', headers: fastHeaders })

 if (!roleRes.ok) {
  return Unauthorized()
 }

 const role = await roleRes.json()

 let apipoint = '/ucitel'
 if (role === 'ST') {
  apipoint = '/student'
 } else if (role === 'RE') {
  apipoint = '/admin'
 }
 console.log(rVybrane)
 return Success()
}
