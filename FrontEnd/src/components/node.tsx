import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Divider } from '@/components/ui/divider'
import { tNode } from '@/lib/types'
import { CalendarDays, Clock, MapPin, UsersRound } from 'lucide-react'
import { Zapsat, Zobrazit } from '@/components/nodeButton'

export default function Node(props: tNode) {
 function CheckDate(date: any) {
  let timeToCheck = new Date(date).setHours(new Date(date).getHours() - 24)
  if (new Date().getTime() < new Date(timeToCheck).getTime()) {
   return true
  } else {
   return false
  }
 }
 const loc = 'cs-CZ'

 const VolnoRender: boolean = CheckDate(props.start)
  ? props.zapsany < props.kapacita
    ? false
    : true
  : true
 const CapRender: boolean = CheckDate(props.start)
  ? props.zapsany >= props.kapacita
    ? true
    : false
  : true

 return (
  <Card className="w-[25rem] h-max min-h-[10rem] bg-gradient-to-tr border-1 border-gray-700 from-black to-gray-800 text-white">
   <CardHeader>
    <div className="text-2xl font-bold">{`${props.predmet} cvičení ${props.cislo}`}</div>
   </CardHeader>
   <Divider />
   <CardContent>
    <div className="text-md flex flex-col my-2">
     <div className="flex flex-row justify-start gap-1 ">
      <Clock className="w-6" />
      <div className="pt-1">
       {new Date(props.start).toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' })} -
       {new Date(props.end).toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' })}
      </div>
     </div>
     <div className="flex flex-row justify-start gap-1">
      <CalendarDays className="w-6" />
      <div className="pt-1">{new Date(props.end).toLocaleDateString()}</div>
     </div>
     <div className="flex flex-row justify-start gap-1">
      <MapPin className="w-6" />
      <div className="pt-1">{props.location}</div>
     </div>
    </div>
   </CardContent>
   <CardFooter className="flex justify-between width-fultems-center">
    <div className="grid grid-cols-[70%_30%] gap-1 w-full">
     <div className="flex flex-col gap-1">
      {props.vypsal.map((item: string, key: number) => (
       <span key={item + key} className="text-xs">{`${item}`}</span>
      ))}
     </div>
     <div className="flex flex-col items-center justify-end">
      <div className="flex gap-2 items-center">
       {`${props.zapsany} / ${props.kapacita}`} <UsersRound className="w-7" />
      </div>

      {props.typ == 'student' ? (
       <Zapsat
        id={props._id}
        owned={props.owned || false}
        date={CheckDate(props.start)}
        VolnoRender={VolnoRender}
        CapRender={CapRender}
        volno={props.zapsany >= props.kapacita}
        setReload={props.setReload}
       />
      ) : (
       <Zobrazit id={props._id} />
      )}
     </div>
    </div>
   </CardFooter>
  </Card>
 )
}
