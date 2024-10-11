import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Divider } from '@/components/ui/divider'
import { tNode } from '@/lib/types'
import { CalendarDays, Clock, Clock12, MapPin, UsersRound } from 'lucide-react'
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
  ? (props?.zapsany || 0) < props.kapacita
    ? false
    : true
  : true
 const CapRender: boolean = CheckDate(props.start)
  ? (props?.zapsany || 0) >= props.kapacita
    ? true
    : false
  : true

 return (
  <Card className="w-[25rem] h-max min-h-[10rem] bg-gradient-to-tr border-1 border-gray-300 dark:border-gray-700 dark:from-black dark:to-gray-800 dark:text-white from-white to-slate-300">
   <CardHeader>
    <div className="text-2xl font-bold">{`${props.nazev} cvičení ${props.cviceni}`}</div>
    <p className="text-sm text-justify">{props.tema}</p>
   </CardHeader>
   <Divider className="mx-auto w-[80%] h-[0.1rem]" variant="fade" margin="mb4"/>
   <CardContent>
    <div className="text-md flex flex-col my-2 gap-1">
     <div className="flex flex-row justify-start gap-1 items-center ">
      <Clock12 className="w-6 text-green-500" />
      <div className="pt-1">{new Date(props.start).toLocaleString()}</div>
     </div>
     <div className="flex flex-row justify-start gap-1 items-center">
      <Clock className="w-6 text-red-500" />
      <div className="pt-1">{new Date(props.konec).toLocaleString()}</div>
     </div>
     <div className="flex flex-row justify-start gap-1 items-center">
      <MapPin className="w-6" />
      <div className="pt-1">{props.ucebna}</div>
     </div>
    </div>
   </CardContent>
   <CardFooter className="flex justify-between width-fultems-center">
    <div className="grid grid-cols-[70%_30%] gap-1 w-full">
     <div className="flex flex-col gap-1 justify-end">
      {props.vypsal?.map((item: string, key: number) => (
       <span key={item + key} className="text-xs">{`${item}`}</span>
      ))}
     </div>
     <div className="flex flex-col items-center justify-end gap-1">
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
        volno={(props?.zapsany || 0) >= props.kapacita}
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
