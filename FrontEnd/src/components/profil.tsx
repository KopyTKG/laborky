import { Get } from '@/app/actions'
import { fastHeaders } from '@/lib/stag'
import { tPredmetSekce } from '@/lib/types'
import { redirect } from 'next/navigation'
import Predmet from './tabulkaPredmet'

export default async function Profil() {
 let predmety: tPredmetSekce[] = []
 try {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/profil`)
  const cookie = await Get('stagUserTicket')
  if (cookie) {
   url.searchParams.set('ticket', cookie.value)
  }

  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (res.status != 200) {
   redirect('/logout')
  } else if (res.status == 200) {
   let jsonParsed = await res.json()
   predmety = jsonParsed.data as tPredmetSekce[]
  }
 } catch {
  redirect('/logout')
 }

 return (
  <>
   <div className="w-full mt-1">
    {predmety.map((predmet: tPredmetSekce, key: number) => {
     return <Predmet predmet={predmet} key={key + Date.now()} lenght={predmety.length-1} />
    })}
   </div>
  </>
 )
}
