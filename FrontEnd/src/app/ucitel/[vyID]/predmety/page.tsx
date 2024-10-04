import Filtr from '@/components/filtr'
import { tSelected } from '@/lib/types'

export default function Page({ searchParams }: { searchParams: tSelected }) {
 const selected = searchParams.s?.split('-') || []

 return (
  <div className="w-full flex justify-evenly">
   <Filtr predmety={selected} />
   {searchParams.s && <h1 className="text-2xl"> {searchParams.s} </h1>}
  </div>
 )
}
