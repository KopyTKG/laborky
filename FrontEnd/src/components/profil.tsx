import { Get } from '@/app/actions'
import { Divider } from '@/components/ui/divider'
import { fastHeaders } from '@/lib/stag'
import { tPredmetSekce } from '@/lib/types'
import { Chip } from '@nextui-org/react'
import { redirect } from 'next/navigation'

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
   <div className="w-full">
    {predmety.map((predmet: tPredmetSekce, key: number) => {
     return (
      <div className="mb-3" key={predmet.nazev}>
       <h3 className="font-bold text-2xl ">{predmet.nazev}</h3>
       <div className="w-full h-max  bg-gradient-to-tr border-1 border-gray-300 dark:border-gray-700 dark:from-black dark:to-gray-800 dark:text-white from-white to-slate-300 rounded-2xl flex flex-col">
        {predmet.cviceni.map((datum: any, key: number) => {
         return (
          <>
           <div
            key={datum.toLocaleString() + key}
            className={`w-full h-full flex flex-row justify-between p-3 bg-gradient-to-l ${key === 0 ? `rounded-t-xl` : key === predmet.cviceni.length - 1 ? 'rounded-b-xl' : ''} ${!datum ? 'from-red-500/15 to-transparent' : 'from-lime-500/15 to-transparent'}`}
           >
            <span className="text-lg">{`Laboratorní cvičení ${key + 1}`}</span>
            <Chip color={datum ? 'success' : 'danger'}>
             {datum ? new Date(datum).toLocaleDateString() : 'nesplnil'}
            </Chip>
           </div>
           {key < predmet.cviceni.length - 1 && <Divider margin="my0" />}
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
