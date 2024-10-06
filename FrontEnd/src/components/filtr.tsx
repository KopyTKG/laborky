'use client'
import { Button, Checkbox, CheckboxGroup, Skeleton } from '@nextui-org/react'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Get } from '@/app/actions'
import { fastHeaders } from '@/lib/stag'
import { tPredmet } from '@/lib/types'

async function fetchPredmetyData() {
 try {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/predmety`)
  const ticket = (await Get('stagUserTicket'))?.value || ''
  url.searchParams.set('ticket', ticket)
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (!res.ok) {
   throw new Error(`Failed to fetch: ${res.statusText}`)
  }
  return await res.json()
 } catch (error) {
  console.error('Error fetching predmety:', error)
  throw error
 }
}

export default function Filtr({ search }: { search: string[] }) {
 const [selected, setSelected] = useState<string[]>(search)
 const [predmety, setPredmety] = useState<tPredmet[]>([])
 const [isLoading, setIsLoading] = useState(true)

 const router = useRouter()
 const pathname = usePathname()
 const searchParams = useSearchParams()

 const updateRoute = useCallback(() => {
  const params = new URLSearchParams(searchParams.toString())
  params.set('s', selected.join('-'))
  router.push(`${pathname}?${params.toString()}`)
 }, [selected, pathname, searchParams, router])

 useEffect(() => {
  async function loadPredmety() {
   try {
    setIsLoading(true)
    const data = (await fetchPredmetyData())?.predmety
    setPredmety(data)
   } catch (e) {
    console.error(e)
   } finally {
    setIsLoading(false)
   }
  }
  loadPredmety()
 }, [])

 return (
  <div className="flex flex-col gap-2 col-start-1 col-span-1 h-full border-r-1 border-l-1 border-stone-700/55 px-2">
   <h3 className="text-lg text-white font-bold w-full text-center border-b-1 pb-1 border-stone-700/55">
    Předměty
   </h3>
   <CheckboxGroup color="warning" value={selected} onValueChange={setSelected}>
    {isLoading && (
     <>
      <Skeleton className="w-full h-6 rounded-xl border-1 border-gray-700 bg-gradient-to-tr from-black to-gray-800 " />
      <Skeleton className="w-full h-6 rounded-xl border-1 border-gray-700 bg-gradient-to-tr from-black to-gray-800 " />
      <Skeleton className="w-full h-6 rounded-xl border-1 border-gray-700 bg-gradient-to-tr from-black to-gray-800 " />
     </>
    )}
    {!isLoading &&
     predmety.map((item, key) => (
      <Checkbox value={item.nazev} key={item._id}>
       {item.nazev}
      </Checkbox>
     ))}
   </CheckboxGroup>
   <Button onClick={updateRoute}>Potvrdit</Button>
  </div>
 )
}
