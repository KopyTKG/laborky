import { User } from '@/data/categorie'
import { Unauthorized } from '@/lib/http'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
 const url = new URL(req.url)
 const rTicket = url.searchParams.get('ticket') || ''

 if (!rTicket) {
  return Unauthorized
 }
 return Response.json({ data: User }, { status: 200 })
}
