import { Get } from '@/app/actions'
import {
 Calendar,
 Clock,
 Users,
 Book,
 FileText,
 Bookmark,
 Trash,
 Check,
 Pencil,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fastHeaders } from '@/lib/stag'
import { tTermin } from '@/lib/types'
import React from 'react'
import {
 AlertDialog,
 AlertDialogContent,
 AlertDialogTrigger,
 AlertDialogHeader,
 AlertDialogTitle,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogCancel,
 AlertDialogAction,
} from '@/components/ui/alert-dialog'
export default function TerminInfo({
 Termin,
 id,
 setNull,
 onOpen,
}: {
 Termin: tTermin
 id: string
 setNull: React.Dispatch<boolean>
 onOpen: () => void
}) {
 const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('cs-CZ', {
   day: '2-digit',
   month: 'long',
   year: 'numeric',
   hour: '2-digit',
   minute: '2-digit',
  }).format(date)
 }

 const fetchDelete = async () => {
  try {
   const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/termin`)
   url.searchParams.set('id', id)
   const cookie = await Get('stagUserTicket')
   if (cookie) {
    url.searchParams.set('ticket', cookie.value)
   }
   const res = await fetch(url.toString(), { method: 'DELETE', headers: fastHeaders })
   if (!res.ok) {
    console.error(res.statusText)
   } else {
    setNull(true)
   }
  } catch (e) {
   console.error(e)
  }
 }

 return (
  <Card className="w-full mb-5 bg-gradient-to-tr border-1 border-gray-300 dark:border-gray-700 dark:from-black dark:to-gray-800 dark:text-white from-white to-slate-300">
   <CardHeader className="pb-2">
    <CardTitle className="text-2xl font-bold flex justify-between">
     <span className="flex gap-2 items-center">
      <Bookmark className="h-6 w-6 text-amber-400" aria-hidden="true" />
      {Termin?.nazev || 'Název předmětu'}
     </span>
     <span className="flex gap-2 items-center">
      <button
       className="text-green-500 hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-full p-1"
       aria-label="Delete"
       onClick={onOpen}
      >
       <Pencil className="w-6 h-6" aria-hidden="true" />
      </button>

      <AlertDialog>
       <AlertDialogTrigger asChild>
        <button
         className="text-red-500 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full p-1"
         aria-label="Delete"
        >
         <Trash className="w-6 h-6" aria-hidden="true" />
        </button>
       </AlertDialogTrigger>
       <AlertDialogContent className="dark:bg-stone-800 dark:text-white text-black border dark:border-stone-900">
        <AlertDialogHeader>
         <AlertDialogTitle>Jste si jisti?</AlertDialogTitle>
         <AlertDialogDescription className='font-medium'>
          Tuto akci nelze vrátit zpět. Trvale to odstraní tento termín z našich serverů.
         </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
         <AlertDialogCancel className="bg-gray-700 dark:bg-gray-200 dark:text-black dark:hover:text-black text-white hover:bg-gray-500 dark:hover:bg-gray-400 hover:text-white">
          Zrušit
         </AlertDialogCancel>
         <AlertDialogAction
          onClick={() => fetchDelete()}
          className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-800"
         >
          Pokračovat
         </AlertDialogAction>
        </AlertDialogFooter>
       </AlertDialogContent>
      </AlertDialog>
     </span>
    </CardTitle>
   </CardHeader>
   <CardContent className="grid gap-4">
    <div className="grid grid-cols-2 gap-4">
     <div className="flex items-center gap-2">
      <Book className="h-5 w-5 text-emerald-400" aria-hidden="true" />
      <span className="text-sm font-medium">Předmět:</span>
      <span className="font-bold">{Termin?._id || 'N/A'}</span>
     </div>
     <div className="flex items-center gap-2">
      <FileText className="h-5 w-5 text-blue-400" aria-hidden="true" />
      <span className="text-sm font-medium">Cvičení:</span>
      <span className="font-bold">{Termin?.cviceni || 'N/A'}</span>
     </div>
    </div>
    <div className="flex items-center gap-2">
     <Users className="h-5 w-5 text-purple-400" aria-hidden="true" />
     <span className="text-sm font-medium">Kapacita:</span>
     <span className="font-bold">{Termin?.kapacita || 'N/A'}</span>
    </div>
    <div className="space-y-2">
     <h3 className="text-lg font-semibold flex items-center gap-2">
      <Calendar className="h-5 w-5 text-red-400" aria-hidden="true" />
      Termín
     </h3>
     <div className="grid grid-cols-2 gap-2 pl-7">
      <div className="flex items-center gap-2">
       <Clock className="h-4 w-4 text-green-400" aria-hidden="true" />
       <span className="text-sm">Začátek:</span>
       <span className="font-medium">{formatDate(Termin?.start)}</span>
      </div>
      <div className="flex items-center gap-2">
       <Clock className="h-4 w-4 text-orange-400" aria-hidden="true" />
       <span className="text-sm">Konec:</span>
       <span className="font-medium">{formatDate(Termin?.konec)}</span>
      </div>
     </div>
    </div>
    <div className="space-y-2">
     <h3 className="text-lg font-semibold flex items-center gap-2">
      <FileText className="h-5 w-5 text-yellow-400" aria-hidden="true" />
      Popis
     </h3>
     <p className="text-sm dark:text-stone-300 pl-7">
      {Termin?.tema || 'Žádný popis není k dispozici.'}
     </p>
    </div>
   </CardContent>
  </Card>
 )
}
