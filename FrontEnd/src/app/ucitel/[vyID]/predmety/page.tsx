import { Get } from '@/app/actions'
import Filtr from '@/components/filtr'
import { fastHeaders } from '@/lib/stag'
import { tSelected } from '@/lib/types'

export default async function Page({ searchParams }: { searchParams: tSelected }) {
 const selected = searchParams.s?.split('-') || []

 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/predmety`)
 const ticket = (await Get('stagUserTicket'))?.value || ''
 url.searchParams.set('ticket', ticket)
 const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
 const predmety: string[] = await res.json()

 return (
  <div className="w-full flex justify-evenly">
   <Filtr predmety={selected} list={predmety} />
   {searchParams.s && <h1 className="text-2xl"> {searchParams.s} </h1>}
  </div>
 )
}
