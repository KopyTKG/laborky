'use client'
import { Get } from '@/app/actions'
import {
 Table,
 TableHeader,
 TableRow,
 TableHead,
 TableBody,
 TableCell,
} from '@/components/ui/table'
import { ReloadCtx } from '@/contexts/ReloadProvider'
import { fastHeaders } from '@/lib/stag'
import { tPredmet, tPredmetBody } from '@/lib/types'
import { Pencil, Trash } from 'lucide-react'
import { useCallback, useContext, useLayoutEffect, useState } from 'react'
import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
 AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { AdminCtx } from '@/contexts/AdminProvider'
import { toast } from '@/hooks/use-toast'

const fetchPredmetyData = async () => {
 try {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/predmety`)
  const cookie = await Get('stagUserTicket')
  if (cookie) {
   url.searchParams.set('ticket', cookie.value)
  }
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (res.status == 401) {
   window.location.href = '/logout'
  } else if (res.status == 200 || res.status == 404) {
   return await res.json()
  }
 } catch (e) {
  console.error(e)
 }
}

export default function Predmety() {
 const [Predmety, setPredmety] = useState<tPredmet[]>([])

 const ReloadContext = useContext(ReloadCtx)
 const AdminContext = useContext(AdminCtx)

 if (!ReloadContext || !AdminContext) {
  throw new Error('Missing ReloadProvider or AdminProvider')
 }

 const [reload, setReload] = ReloadContext
 const { open, setOpen, setStorage } = AdminContext

 const fetchPredmety = useCallback(async () => {
  const data = await fetchPredmetyData()
  if (data) {
   setPredmety(data.predmety)
   setReload(false)
  }
 }, [reload])

 useLayoutEffect(() => {
  fetchPredmety()
 }, [reload])

 async function onDelete(kod: string) {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/predmet`)
  const cookie = await Get('stagUserTicket')
  if (cookie) {
   url.searchParams.set('ticket', cookie.value)
  }
  kod ? url.searchParams.set('kod_predmetu', kod) : url.searchParams.set('kod_predmetu', '')

  const res = await fetch(url.toString(), { method: 'DELETE', headers: fastHeaders })
  if (!res.ok) {
   toast({
    title: 'Něco se nepovedlo',
    description: 'Nastala chyba při mazání předmětu',
    variant: 'destructive',
   })
  } else {
   toast({
    title: 'Povedlo se',
    description: 'Mazání předmětu dokončeno',
   })
   setReload(!reload)
  }
 }

 return (
  <Table>
   <TableHeader>
    <TableRow>
     <TableHead>Kód předmětu</TableHead>
     <TableHead>Zkratka</TableHead>
     <TableHead>Katedra</TableHead>
     <TableHead>Počet cvičení</TableHead>
     <TableHead>Operace</TableHead>
    </TableRow>
   </TableHeader>
   <TableBody>
    {Predmety
     ? Predmety.map((predmet: tPredmet) => (
        <TableRow key={predmet._id}>
         <TableCell>{predmet.nazev}</TableCell>
         <TableCell>{predmet.nazev.split('/')[0]}</TableCell>
         <TableCell>{predmet.nazev.split('/')[1]}</TableCell>
         <TableCell align="center">{predmet.nCviceni}</TableCell>
         <TableCell align="center">
          <div className="flex gap-1">
           <button
            className="text-amber-500 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 rounded-full p-1"
            aria-label="Edit"
            onClick={() => {
             setOpen(!open)
             setStorage({
              kod: predmet.nazev,
              zkratka: predmet.nazev.split('/')[1],
              katedra: predmet.nazev.split('/')[0],
              cviceni: predmet.nCviceni,
             } as tPredmetBody)
            }}
           >
            <Pencil className="w-5 h-5" aria-hidden="true" />
           </button>
           <AlertDialog>
            <AlertDialogTrigger asChild>
             <button
              className="text-red-500 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full p-1"
              aria-label="Delete"
             >
              <Trash className="w-5 h-5" aria-hidden="true" />
             </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="dark:bg-zinc-950 dark:text-white text-black border dark:border-zinc-900 shadow-md">
             <AlertDialogHeader>
              <AlertDialogTitle>Jste si jisti?</AlertDialogTitle>
              <AlertDialogDescription className="font-medium">
               Tuto akci nelze vrátit zpět. Trvale to odstraní tento termín z našich serverů.
              </AlertDialogDescription>
             </AlertDialogHeader>
             <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-700 dark:bg-gray-200 dark:text-black dark:hover:text-black text-white hover:bg-gray-500 dark:hover:bg-gray-400 hover:text-white">
               Zrušit
              </AlertDialogCancel>
              <AlertDialogAction
               onClick={() => onDelete(predmet._id)}
               className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-800"
              >
               Pokračovat
              </AlertDialogAction>
             </AlertDialogFooter>
            </AlertDialogContent>
           </AlertDialog>
          </div>
         </TableCell>
        </TableRow>
       ))
     : null}
   </TableBody>
  </Table>
 )
}
