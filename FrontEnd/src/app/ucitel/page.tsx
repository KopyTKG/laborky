'use client'

import Strom from '@/modules/strom.display'

export default function UcitelPage() {
 const dataPredmety = [
  {
   name: 'PCA',
   skupiny: [
    {
     name: 'Cvičeni 1',
     count: 10,
     type: 1,
    },
    {
     name: 'Cvičeni 2',
     count: 10,
     type: 2,
    },
    {
     name: 'Cvičeni 3',
     type: 3,
     count: 5,
    },
   ],
   aktualni: [
    {
     type: 1,
     taken: 5,
     capacity: 10,
     date: '2022-01-01',
    },
    {
     type: 2,
     taken: 5,
     capacity: 14,
     date: '2022-01-01',
    },
    {
     type: 3,
     taken: 0,
     capacity: 5,
     date: '2022-01-01',
    },
   ],
  },
  {
   name: 'ZPS',
   skupiny: [
    {
     name: 'Cvičeni 1',
     count: 10,
     type: 1,
    },
    {
     name: 'Cvičeni 2',
     count: 10,
     type: 2,
    },
    {
     name: 'Cvičeni 3',
     type: 3,
     count: 5,
    },
   ],
   aktualni: [
    {
     type: 1,
     taken: 5,
     capacity: 10,
     date: '2022-01-01',
    },
    {
     type: 2,
     taken: 5,
     capacity: 14,
     date: '2022-01-01',
    },
    {
     type: 3,
     taken: 0,
     capacity: 5,
     date: '2022-01-01',
    },
   ],
  },
  {
   name: 'ZEL',
   skupiny: [
    {
     name: 'Cvičeni 1',
     count: 10,
     type: 1,
    },
    {
     name: 'Cvičeni 2',
     count: 10,
     type: 2,
    },
    {
     name: 'Cvičeni 3',
     type: 3,
     count: 5,
    },
   ],
   aktualni: [
    {
     type: 1,
     taken: 5,
     capacity: 10,
     date: '2022-01-01',
    },
    {
     type: 2,
     taken: 5,
     capacity: 14,
     date: '2022-01-01',
    },
    {
     type: 3,
     taken: 0,
     capacity: 5,
     date: '2022-01-01',
    },
   ],
  },
 ]

 return (
  <main className="container min-h-screen mx-auto mt-5">
   {dataPredmety.map((dataPredmet: any) => (
    <Strom key={dataPredmet.name} dataPredmet={dataPredmet} />
   ))}
  </main>
 )
}
