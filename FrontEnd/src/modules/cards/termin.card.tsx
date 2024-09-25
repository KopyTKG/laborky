import Icon from '@/components/icon'
import { Card, CardBody, Link, Tooltip } from '@nextui-org/react'

export default function Termin({
 name,
 date,
 id,
 capacity,
 taken,
 skupina,
}: {
 name: string
 date: Date
 id: string
 capacity: number
 taken: number
 skupina: string
}) {
 return (
  <>
   <Tooltip content={`Zobrazit termin - ${id}`} showArrow={true} delay={500}>
    <Link href={`/ucitel/predmety/${name}?q=${id}`} className="w-72 h-30">
     <Card className="border-2 border-white bg-gray-300 text-black min-w-unit-24 w-full h-full">
      <CardBody className="flex flex-col justify-center items-center  py-5 px-10 ">
       <div className="flex flex-row gap-2">
        <div className="text-2xl font-bold">{name}</div>
       </div>
       <div className="flex flex-row gap-2">
        <Icon name="calendar-days" className="w-6" />
        <div className="text-2xl font-bold">{date.toLocaleDateString()}</div>
       </div>
       <div className="flex flex-row gap-2">
        <Icon name="users" className="w-6" />
        <div className="text-xl font-bold">
         {taken} / {capacity}
        </div>
       </div>
       <div className="flex flex-row gap-2">
        <div className="text-xl font-bold">Cvičení {skupina}</div>
       </div>
      </CardBody>
     </Card>
    </Link>
   </Tooltip>
  </>
 )
}
