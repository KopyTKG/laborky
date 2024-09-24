import Node from '@/components/node'
import { Terminy as data } from '@/data/terminy'

type Ttermin = {
 _id: number
 zapsany: string[]
}

export default function VypsaneTerminy() {
 function loadAPI() {
  // needs to be API call to from validation and fetching data
  return data as Ttermin[]
 }

 const Terminy: Ttermin[] = loadAPI()

 return (
  <>
   <div className="w-max grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-3">
    {Terminy.map((termin: Ttermin) => (
     <Node key={termin._id} owned={false} {...termin} />
    ))}
   </div>
  </>
 )
}
