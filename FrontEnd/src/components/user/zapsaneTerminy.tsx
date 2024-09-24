import Node from '@/components/node'
import { Moje as data } from '@/data/terminy'

type Ttermin = {
 _id: number
 zapsany: string[]
}

export default function ZapsaneTerminy() {
 function loadAPI() {
  // needs to be API call to from validation and fetching data
  return data as Ttermin[]
 }

 function loadID() {
  // needs to get some ID from API / cookies / local storage for user
  return '1f3as45fefvae4'
 }

 const Terminy: Ttermin[] = loadAPI()
 const ID: string = loadID()

 return (
  <>
   <div className="w-max grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-3">
    {Terminy.map((termin: Ttermin) => (
     <Node key={termin._id} owned={termin.zapsany.includes(ID) ? true : false} {...termin} />
    ))}
   </div>
  </>
 )
}
