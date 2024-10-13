import { Unauthorized, NotFound, Success, Internal } from '@/lib/http'
import { setupParser } from '@/lib/parsers'
import { fastHeaders, GetTicket } from '@/lib/stag'
import { tPredmetSekce, tStudent } from '@/lib/types'

type tResponse = {
 info: {
  osCislo: string
  jmeno: string
  prijmeni: string
  email: string
 }
 profil: {
  [key: string]: number[]
 }
}

export async function GET(req: Request) {
 const rTicket = GetTicket(req)
 if (!rTicket) return Unauthorized()
 const base = new URL(req.url)
 const rId_stud = base.searchParams.get('id_stud') || ''

 if (!rId_stud) return NotFound()

 const checkURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/setup`)
 checkURL.searchParams.set('ticket', rTicket)
 const roleRes = await fetch(checkURL.toString(), { method: 'GET', headers: fastHeaders })

 if (!roleRes.ok) {
  return Unauthorized()
 }

 const data = await roleRes.json()
 if (!data) return Internal()

 const info = setupParser(data)

 if (info.role == 'ST') {
  return Unauthorized()
 }

 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/ucitel/student`)
 url.searchParams.set('ticket', rTicket)
 url.searchParams.set('id_stud', rId_stud)

 const res = await fetch(url.toString(), {
  method: 'GET',
  headers: fastHeaders,
 })
 if (!res.ok) {
  return Internal()
 }

 const studentInfo = (await res.json()) as tResponse
 const keys = Object.keys(studentInfo.profil)
 const student: tStudent = studentInfo.info
 const parsed: tPredmetSekce[] = []
 keys.forEach((item: string) => {
  let tmp: tPredmetSekce = {
   nazev: item,
   cviceni: studentInfo.profil[item],
  }
  parsed.push(tmp)
 })

 return Success({info: student, data: parsed})
}
