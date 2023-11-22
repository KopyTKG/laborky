'use client'
import Predmet from '@/modules/cards/predmet.card'
import Skupina from '@/modules/cards/skupina.card'
import Termin from '@/modules/cards/termin.card'
import React from 'react'

const tmp = [
 {
  name: 'Cvičeni 1',
  predmet: 'PCA',
  count: 10,
  type: 1,
  date: '2022-01-01',
  capacity: 10,
  taken: 5,
 },
 {
  name: 'Cvičeni 2',
  predmet: 'PCA',
  count: 10,
  type: 2,
  taken: 5,
  capacity: 14,
  date: '2022-01-01',
 },
 {
  name: 'Cvičeni 3',
  predmet: 'PCA',
  type: 3,
  count: 5,
  taken: 0,
  capacity: 5,
  date: '2022-01-01',
 },
]
export default function UcitelPage() {
 return (
  <main className="container min-h-screen mx-auto mt-5">
   <div className="flex w-full  gap-2 justify-center">
    <Column className="items-end pr-4">
     <Predmet name="PCA" />
    </Column>
    <Column>
     {tmp.map((item) => (
      <Skupina
       key={item.name}
       name={item.name}
       predmet={item.predmet}
       id={item.type.toString()}
       count={item.count}
      />
     ))}
    </Column>
    <Column>
     {tmp.map((item) => (
      <Termin
       key={item.name}
       name={item.predmet}
       date={new Date(item.date)}
       id={item.type.toString()}
       capacity={item.count}
       taken={item.taken}
      />
     ))}
    </Column>
   </div>
  </main>
 )
}

function Column({ children, className }: { children: React.ReactNode; className?: string }) {
 return <div className={`flex flex-col gap-2 max-w-80 ${className}`}>{children}</div>
}
