import { Success, Unauthorized } from '@/lib/http'
//import { getStagUser } from '@/lib/stag'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
 const url = new URL(req.url)
 const rTicket = url.searchParams.get('ticket') || ''
 if (!rTicket) {
  return Unauthorized
 } else {
  //const sData = await getStagUser(rTicket)

  // Add connection to FAST API to check if user exists
  // status 401
  return Success
 }
}
