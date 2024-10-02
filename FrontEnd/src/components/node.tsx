import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Divider } from '@/components/ui/divider'
import Icon from '@/components/icon'
import { Get } from '@/app/actions'

function Zobrazit({ id }: { id: string }) {
 function APIcall(id: string) {
  alert(id)
 }
 return (
  <Button onClick={() => APIcall(id)} variant="secondary">
   Zobrazit
  </Button>
 )
}

function Zapsat({
 id,
 owned,
 date,
 VolnoRender,
 CapRender,
 volno,
}: {
 id: string
 owned: boolean
 date: boolean
 VolnoRender: boolean
 CapRender: boolean
 volno: boolean
}) {
 async function APIcall(id: string) {
  try {
   const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/zapsat`)
   url.searchParams.set('id', id)
   console.log(id)
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
  <Button
   className="border border-black"
   variant={owned ? 'danger' : CapRender ? 'danger' : 'success'}
   disabled={!owned ? VolnoRender : date ? false : true}
   onClick={() => APIcall(id)}
  >
   {!owned && (volno ? 'Obsazeno' : 'Zapsat se')}
   {owned && (date ? 'Odepsat se' : 'Nelze se odepsat')}
  </Button>
 )
}

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

 const VolnoRender: boolean = CheckDate(props.start)
  ? studenti < props.kapacita
    ? false
    : true
  : true
 const CapRender: boolean = CheckDate(props.start)
  ? studenti >= props.kapacita
    ? true
    : false
  : true

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
     {props.typ == 'student' ? (
      <Zapsat
       id={props.id}
       owned={props.owned}
       date={CheckDate(props.start)}
       VolnoRender={VolnoRender}
       CapRender={CapRender}
       volno={studenti >= props.kapacita}
      />
     ) : (
      <Zobrazit id={props.id} />
     )}
    </div>
   </CardFooter>
  </Card>
 )
}
