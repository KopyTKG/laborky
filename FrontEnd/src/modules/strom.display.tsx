import Predmet from '@/modules/cards/predmet.card'
import Skupina from '@/modules/cards/skupina.card'
import Termin from '@/modules/cards/termin.card'
import { Divider } from '@nextui-org/react'
import React from 'react'
function Row({ children, className }: { children: React.ReactNode; className?: string }) {
 return <div className={`flex flex-row gap-2 max-w-80 ${className}`}>{children}</div>
}
export default function Strom({ dataPredmet }: { dataPredmet: any }) {
 return (
  <div className="flex flex-col w-full  gap-2 items-center">
   <h2 className="text-2xl font-bold">Vypsaný předmět</h2>

   <Row className="items-end pr-4">
    <Predmet name={dataPredmet.name} />
   </Row>

   <h2 className="text-2xl font-bold">Skupiny pro tento předmět</h2>

   <Row>
    {dataPredmet.skupiny.map((item: any) => (
     <Skupina
      key={item.name}
      name={item.name}
      predmet={dataPredmet.name}
      id={item.type.toString()}
      count={item.count}
     />
    ))}
   </Row>

   <h2 className="text-2xl font-bold">Aktuálně nadcházející termíny</h2>
   <Row>
    {dataPredmet.aktualni.map((item: any) => (
     <Termin
      key={item.type + item.date}
      name={dataPredmet.name}
      date={new Date(item.date)}
      id={item.type.toString()}
      capacity={item.capacity}
      taken={item.taken}
      skupina={item.type}
     />
    ))}
   </Row>
   <Divider className="my-4 py-[0.1rem]" />
  </div>
 )
}
