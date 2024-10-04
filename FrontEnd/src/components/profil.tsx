import { Get } from '@/app/actions'
import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'
import { tPredmet } from '@/lib/types'
import { Chip } from '@nextui-org/react'
import { redirect } from 'next/navigation'

export default async function Profil() {
 let predmety: tPredmet[] = []
 try {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/profil`)
  const cookie = await Get('stagUserTicket')
  if (cookie) {
   url.searchParams.set('ticket', cookie.value)
  }
  const headers = {
   Accept: 'application/json',
   'Content-Type': 'application/json',
   Connection: 'keep-alive',
   'Accept-Origin': `${process.env.NEXT_PUBLIC_BASE}`,
  }
  const res = await fetch(url.toString(), { method: 'GET', headers })
  if (res.status != 200) {
   redirect('/logout')
  } else if (res.status == 200) {
   let jsonParsed = await res.json()
   predmety = jsonParsed.data as tPredmet[]
  }
 } catch {
  redirect('/logout')
 }

 return (
  <>
   <div className="w-full">
    {predmety.map((predmet: tPredmet, key: number) => {
     return (
      <div className="mb-3" key={predmet.nazev}>
       <h3 className="font-bold text-2xl">{predmet.nazev}</h3>
       <div className="w-full h-max p-3  bg-stone-900 rounded-2xl flex flex-col gap-1">
        {predmet.cviceni.map((datum: any, key: number) => {
         return (
          <>
           <div key={datum.toLocaleString() + key} className="flex flex-row justify-between">
            <span className="text-lg">{`Laboratorní cvičení ${key + 1}`}</span>
            <Chip color={datum ? 'success' : 'danger'}>
             {datum ? new Date(datum).toLocaleDateString() : 'nesplnil'}
            </Chip>
           </div>
           {key < predmet.cviceni.length - 1 && <Divider margin="my2" />}
          </>
         )
        })}
       </div>
       {key < predmety.length - 1 && <Divider margin="my4" variant="ghost" />}
      </div>
     )
    })}
   </div>
  </>
 )
}
