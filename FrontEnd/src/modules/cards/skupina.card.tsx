import { Card, CardBody, Link, Tooltip } from '@nextui-org/react'

export default function Skupina({
 name,
 id,
 count,
 predmet,
}: {
 name: string
 id: string
 count: number
 predmet: string
}) {
 return (
  <>
   <Tooltip content={`Zobrazit terminy pro cvičení ${id}`} showArrow={true} delay={500}>
    <Link href={`/ucitel/predmet/${predmet}?cv=${id}`} className="w-72 h-28">
     <Card className="border-2 border-white bg-gray-300 text-black min-w-unit-24 w-full h-full">
      <CardBody className="flex flex-col justify-center items-center  py-5 px-10 ">
       <div className="text-3xl font-bold">{name}</div>
       <div className="text-xl font-bold">Vypsané: {count}</div>
      </CardBody>
     </Card>
    </Link>
   </Tooltip>
  </>
 )
}
