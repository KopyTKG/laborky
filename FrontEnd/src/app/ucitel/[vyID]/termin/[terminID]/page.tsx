'use client'

import { Get } from '@/app/actions'
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Check } from 'lucide-react'
import { fastHeaders } from '@/lib/stag'
import { tStudent, tTermin } from '@/lib/types'
import React, { useState, useCallback, useEffect } from 'react'
import { useDisclosure } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import TerminInfo from '@/components/terminInfo'
import Uprav from '@/components/uprav'
import { toast } from '@/hooks/use-toast'

const fetchTerminData = async (id: string) => {
 try {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/termin`)
  url.searchParams.set('id', id)
  const cookie = await Get('stagUserTicket')
  if (cookie) {
   url.searchParams.set('ticket', cookie.value)
  }
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (!res.ok) {
   return null
  }
  return await res.json()
 } catch (e) {
  console.error(e)
  return null
 }
}

export default function TerminPage({ params }: { params: { terminID: string } }) {
 const [Termin, setTermin] = useState<tTermin>()
 const [Studenti, setStudenti] = useState<tStudent[]>([])
 const [noData, setNull] = useState<boolean>(false)
 const [fetching, setFetching] = useState<boolean>(true)
 const [reload, setReload] = useState<boolean>(true)
 const { isOpen, onOpen, onOpenChange } = useDisclosure()
 const router = useRouter()

 const fetchTermin = useCallback(async () => {
  const data = await fetchTerminData(params.terminID)
  if (data) {
   setTermin(data.termin)
   setStudenti(data.studenti)
  } else {
   setNull(true)
  }
  setFetching(false)
 }, [params.terminID])

 useEffect(() => {
  fetchTermin()
  setReload(false)
 }, [fetchTermin, reload])

 useEffect(() => {
  if (noData) {
   router.push('/')
  }
 }, [noData, router])

 if (fetching) {
  return (
   <Skeleton className="w-full h-[18rem] rounded-xl" />
  )
 }

 if (noData) {
  return null // This will be rendered briefly before the redirect takes effect
 }

 const sendStudent = async (osCislo: string) => {
  try {
   const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/splnil`)
   const cookie = await Get('stagUserTicket')
   if (cookie) {
    url.searchParams.set('ticket', cookie.value)
   }
   url.searchParams.set('id_stud', osCislo)
   url.searchParams.set('id_terminu', params.terminID)
   const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
   if (!res.ok) {
    return null
   }
   setReload(true)
   toast({
	title: 'Úspěch',
	description: 'Splnění termínu zapsáno'
   })
  } catch (e) {
   console.error(e)
   return null
  }
 }

 return (
  <>
   <TerminInfo
    Termin={Termin || ({} as tTermin)}
    id={params.terminID}
    setNull={setNull}
    onOpen={onOpen}
   />
   <Table>
    <TableHeader>
     <TableRow>
      <TableHead>Osobní číslo</TableHead>
      <TableHead>Jméno</TableHead>
      <TableHead>Příjmení</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Splnil</TableHead>
     </TableRow>
    </TableHeader>
    <TableBody>
     {Studenti.map((student: tStudent) => (
      <TableRow key={student.osCislo}>
       <TableCell className="font-medium">{student.osCislo}</TableCell>
       <TableCell>{student.jmeno}</TableCell>
       <TableCell>{student.prijmeni}</TableCell>
       <TableCell>{student.email}</TableCell>
       <TableCell>
        {!student.datum_splneni ? (
         <span
          className="text-green-500 cursor-pointer active:opacity-50"
          onClick={() => sendStudent(student.osCislo)}
         >
          <Check className="w-6" />
         </span>
        ) : (
         <></>
        )}
       </TableCell>
      </TableRow>
     ))}
    </TableBody>
   </Table>
   <Uprav
    onOpenChange={onOpenChange}
    isOpen={isOpen}
    termin={Termin || ({} as tTermin)}
    setReload={setReload}
    reload={reload}
    id={params.terminID}
   />
  </>
 )
}
