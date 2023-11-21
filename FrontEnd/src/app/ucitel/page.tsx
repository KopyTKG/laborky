import { Divider, Link } from '@nextui-org/react'
import React from 'react'

const tmp = [
 {
  name: 'Cvičeni 1 (10)',
  type: 1,
  date: '2022-01-01',
 },
 {
  name: 'Cvičeni 2 (10)',
  type: 2,

  date: '2022-01-01',
 },
 {
  name: 'Cvičeni 3 (5)',
  type: 3,

  date: '2022-01-01',
 },
]
export default function UcitelPage() {
 return (
  <main className="container min-h-screen mx-auto mt-5">
   <div className="grid grid-cols-1 md:grid-cols-3  gap-2">
    <Link
     href="/ucitel/predmet/pca"
     className="w-full bg-orange-400 text-black h-32 rounded-2xl flex flex-col justify-center items-center text-3xl font-bold ">
     PCA
    </Link>
    <div className="flex flex-col gap-2 col-span-2">
     {tmp.map((item) => (
      <div key={item.name}>
       <Link
        href={`/ucitel/predmet/pca?cv=${item.type}`}
        className="w-full bg-gray-300 text-black h-32 rounded-2xl flex flex-col justify-center items-center text-3xl font-bold">
        <Node>{item.name}</Node>
       </Link>
       <Link
        href={`/ucitel/predmet/pca?q=${item.type}`}
        className="w-full bg-gray-300 text-black h-32 rounded-2xl flex flex-col justify-center items-center text-3xl font-bold">
        <Node>{item.date}</Node>
       </Link>
      </div>
     ))}
    </div>
   </div>
   <Divider className="my-5" />
   <div className="grid grid-cols-1 md:grid-cols-3  gap-2">
    <Link
     href="/ucitel/predmet/zps"
     className="w-full bg-red-400 text-black h-32 rounded-2xl flex flex-col justify-center items-center text-3xl font-bold ">
     ZPS
    </Link>
    <div className="flex flex-col gap-2 col-span-2">
     {tmp.map((item) => (
      <div key={item.name} className="flex gap-2">
       <Node>{item.name}</Node>
       <Node>{item.date}</Node>
      </div>
     ))}
    </div>
   </div>
  </main>
 )
}

function Node({ children }: { children: React.ReactNode }) {
 return <>{children}</>
}
