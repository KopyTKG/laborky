import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Divider } from '@/components/ui/divider'
import Icon from '@/components/icon'
import { Get } from '@/app/actions'

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
 const loc = 'cs-CZ'

 const VolnoRender: any = CheckDate(props.start) ? (studenti < props.kapacita ? false : true) : true
 const CapRender: any = CheckDate(props.start) ? (studenti >= props.kapacita ? true : false) : true

 async function Zapsat(_id: string) {
  try {
   const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/zapsat`)
   url.searchParams.set('id', _id)
   console.log(_id)
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
    alert(res.statusText)
   } else {
    alert(res.statusText)
   }
  } catch {
   window.location.href = '/logout'
  }
 }

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
       {new Date(props.start).toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' })} -
       {new Date(props.end).toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' })}
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
    <div className="flex flex-col gap-1">
     <div className="flex self-start gap-2 items-center">
      {`${studenti} / ${props.kapacita}`} <Icon name="users-round" className="w-7" />
     </div>
     <span className="text-sm">{`${props.vypsal}`}</span>
    </div>
    <div className=" flex self-end">
     <Button
      className="border border-black"
      variant={props.owned ? 'danger' : CapRender ? 'danger' : 'success'}
      disabled={!props.owned ? VolnoRender : CheckDate(props.start) ? false : true}
      onClick={() => Zapsat(props._id)}
     >
      {!props.owned && (studenti >= props.kapacita ? 'Obsazeno' : 'Zapsat se')}
      {props.owned && (CheckDate(props.start) ? 'Odepsat se' : 'Nelze se odepsat')}
     </Button>
    </div>
   </CardFooter>
  </Card>
 )
}
