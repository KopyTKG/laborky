import { Unauthorized } from '@/lib/http'
import { tPredmetInfo } from '@/lib/types'

export async function GET(req: Request) {
 const url = new URL(req.url)
 const rTicket = url.searchParams.get('ticket') || ''

 if (!rTicket) {
  return Unauthorized
 }

 const predmety: tPredmetInfo[] = [
  {
   _id: 'a1',
   zkratka: 'PCA',
   nazev: 'Architektura pocitacu',
   nCviceni: 3,
   vyucujici: 'TBD',
  },
  {
   _id: 'a2',
   zkratka: 'ZPS',
   nazev: 'Zaklady pocitacovych siti',
   nCviceni: 2,
   vyucujici: 'TBD',
  },
  {
   _id: 'a3',
   zkratka: 'ZEL',
   nazev: 'Zaklady elektroniky',
   nCviceni: 3,
   vyucujici: 'TBD',
  },
  {
   _id: 'a4',
   zkratka: 'Nic',
   nazev: 'Volne tema',
   nCviceni: 0,
   vyucujici: '',
  },
 ]
 return Response.json({ data: predmety }, { status: 200, statusText: 'ok' })
}
