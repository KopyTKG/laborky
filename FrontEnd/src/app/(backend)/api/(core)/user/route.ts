import { Success, Unauthorized } from '@/lib/http'
import { getTicket, getUserInfo } from '@/lib/stag'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
 const rTicket = getTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()

 return Success()
}
