import { isAdmin } from '@/lib/functions'
import { Forbidden, Internal, NotFound, Success, Unauthorized } from '@/lib/http'
import { fastHeaders, getTicket, getUserInfo } from '@/lib/stag'
import { tPredmetBody } from '@/lib/types'

/* ----------------------------------------------------------------------------------------------- */
// Create
export async function POST(req: Request) {
 const rTicket = getTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (!isAdmin(info)) return Forbidden()

 const body: tPredmetBody  = await req.json()
 if (!body) return NotFound()

 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/admin/predmet`)
 if(body.zkratka) url.searchParams.set('zkratka_predmetu', body.zkratka)
 if(body.katedra) url.searchParams.set('katedra', body.katedra)
 if(body.cviceni) url.searchParams.set('pocet_cviceni', body.cviceni.toString())
 url.searchParams.set('ticket', rTicket)

 const res = await fetch(url.toString(), {method:'POST', headers: fastHeaders})
 if(!res.ok) return Internal()
 return Success()
}

/* ----------------------------------------------------------------------------------------------- */
// Update
export async function PATCH(req: Request) {
 const rTicket = getTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (!isAdmin(info)) return Forbidden()

 const base = new URL(req.url)
 const rKod_predmetu = base.searchParams.get('kod_predmetu') || ''
 if (!rKod_predmetu) return NotFound()

 return Success()
}

/* ----------------------------------------------------------------------------------------------- */
// Delete
export async function DELETE(req: Request) {
 const rTicket = getTicket(req)
 if (!rTicket) return Unauthorized()
 const info = await getUserInfo(rTicket)
 if (!info) return Unauthorized()
 if (!isAdmin(info)) return Forbidden()

 const base = new URL(req.url)
 const rKod_predmetu = base.searchParams.get('kod_predmetu') || ''
 if (!rKod_predmetu) return NotFound()

 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/admin/predmet`)
 url.searchParams.set('ticket', rTicket)
 url.searchParams.set('zkratka_predmetu', rKod_predmetu.split('/')[1])
 url.searchParams.set('katedra', rKod_predmetu.split('/')[0])

 const res = await fetch(url.toString(), { method: 'DELETE', headers: fastHeaders })
 if (!res.ok) return Internal()
 return Success()
}
