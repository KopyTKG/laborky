import { CalendarDaysIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { Card, CardBody, Link, Tooltip } from '@nextui-org/react'

export default function Termin({
 name,
 date,
 id,
 capacity,
 taken,
}: {
 name: string
 date: Date
 id: string
 capacity: number
 taken: number
}) {
 return (
  <>
   <Tooltip content={`Zobrazit termin - ${id}`} showArrow={true} delay={500}>
    <Link href={`/ucitel/predmet/${name}?q=${id}`} className="w-72 h-28">
     <Card className="border-2 border-white bg-gray-300 text-black min-w-unit-24 w-full h-full">
      <CardBody className="flex flex-col justify-center items-center  py-5 px-10 ">
       <div className="flex flex-row gap-2">
        <CalendarDaysIcon className="w-6" />
        <div className="text-2xl font-bold">{date.toLocaleDateString()}</div>
       </div>
       <div className="flex flex-row gap-2">
        <UserGroupIcon className="w-6" />
        <div className="text-xl font-bold">
         {taken} / {capacity}
        </div>
       </div>
      </CardBody>
     </Card>
    </Link>
   </Tooltip>
  </>
 )
}
