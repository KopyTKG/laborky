import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Divider } from '@/components/ui/divider'
import Icon from '@/components/icon'

export default function Node(props: any) {
 const studenti = (props.zapsany as string[]).length

 function CheckDate(date: any) {
  let timeToCheck = new Date(date).setHours(new Date(date).getHours() - 24)
  if (new Date().getTime() < new Date(timeToCheck).getTime()) {
   return true
  } else {
   return false
  }
 }

 const VolnoRender: any = CheckDate(props.start) ? (studenti < props.kapacita ? false : true) : true
 const CapRender: any = CheckDate(props.start) ? (studenti >= props.kapacita ? true : false) : true

 return (
  <Card className="w-[25rem] h-max bg-gradient-to-tr border-1 border-gray-700 from-black to-gray-800 text-white">
   <CardHeader>
    <div className="text-2xl font-bold">{`${props.predmet} Laboratorní cvičení ${props.cislo}`}</div>
   </CardHeader>
   <Divider />
   <CardContent>
    <div className="text-md flex flex-col">
     <div className="flex flex-row justify-start gap-1 ">
      <Icon name="clock" className="w-6" />
      <div className="pt-1">
       {new Date(props.start).toLocaleTimeString()} - {new Date(props.end).toLocaleTimeString()}
      </div>
     </div>
     <div className="flex flex-row justify-start gap-1">
      <Icon name="calendar-days" className="w-6" />
      <div className="pt-1">{new Date(props.end).toLocaleDateString()}</div>
     </div>
     <div className="flex flex-row justify-start gap-1">
      <Icon name="map-pin" className="w-6" />
      <div className="pt-1">{props.location}</div>
     </div>
    </div>
   </CardContent>
   <CardFooter className="flex justify-between width-fultems-center">
    <div className="flex self-start gap-2 items-center">
     {`${studenti} / ${props.kapacita}`} <Icon name="users-round" className="w-7" />
    </div>
    <div className=" flex self-end">
     {!props.owned ? (
      <Button
       className="border border-black"
       variant={CapRender ? 'danger' : 'success'}
       disabled={VolnoRender}
      >
       {studenti == props.cap ? 'Obsazeno' : 'Zapsat se'}
      </Button>
     ) : (
      <Button
       className="border border-black"
       variant="danger"
       disabled={CheckDate(props.start) ? false : true}
      >
       {CheckDate(props.start) ? 'Odepsat se' : 'Nelze se odepsat'}
      </Button>
     )}
    </div>
   </CardFooter>
  </Card>
 )
}
