'use client'
import { useState, useLayoutEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { Calendar as CalendarIcon, Clock, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogFooter,
 DialogHeader,
 DialogTitle,
 DialogTrigger,
} from '@/components/ui/dialog'
import {
 Form,
 FormControl,
 FormDescription,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Get } from '@/app/actions'
import { tCreate, tPredmet } from '@/lib/types'
import { fastHeaders } from '@/lib/stag'
import { ReloadCtx } from '@/contexts/ReloadProvider'

const formSchema = z.object({
 subject: z.string().min(1, { message: 'Předmět je povinný' }),
 exercise: z.string().optional(),
 name: z.string().optional(),
 theme: z.string().min(1, { message: 'Téma je povinné' }),
 classroom: z.string().min(1, { message: 'Učebna je povinná' }),
 capacity: z.number().min(1, { message: 'Kapacita musí být alespoň 1' }),
 startDate: z.date({ required_error: 'Datum začátku je povinné' }),
 startTime: z
  .string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Neplatný formát času' }),
 endDate: z.date({ required_error: 'Datum konce je povinné' }),
 endTime: z
  .string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Neplatný formát času' }),
 notifyStudents: z.boolean().default(true),
})

const fetchPredmetyData = async () => {
 try {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/predmety`)
  const cookie = await Get('stagUserTicket')
  if (cookie) {
   url.searchParams.set('ticket', cookie.value)
  }
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (!res.ok) {
   console.error(res.statusText)
  } else if (res.ok) {
   return await res.json()
  }
 } catch (e) {
  console.error(e)
 }
}

export default function EventForm() {
 const [predmety, setPredmety] = useState<tPredmet[]>([])
 const [selectedSubject, setSelectedSubject] = useState<tPredmet | null>(null)
 const [open, setOpen] = useState<boolean>(false)
 const [loading, setLoading] = useState<boolean>(true)
 const { toast } = useToast()

 const context = useContext(ReloadCtx)

 if (!context) {
  throw new Error('Missing ReloadProvider')
 }

 const [reload, setReload] = context

 const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
   subject: '',
   exercise: '',
   name: '',
   theme: '',
   classroom: '',
   capacity: 0,
   startDate: new Date(),
   startTime: '',
   endDate: new Date(),
   endTime: '',
   notifyStudents: true,
  },
 })

 useLayoutEffect(() => {
  const loadPredmety = async () => {
   try {
    const data = (await fetchPredmetyData())?.predmety
    if (data) {
     setPredmety(data)
     setLoading(false)
    }
   } catch (e) {
    console.error(e)
   }
  }
  loadPredmety()
 }, [])

 async function onSubmit(values: z.infer<typeof formSchema>) {
	 const regex = /[0-2][0-9]:[0-6][0-9]:[0-6][0-9]/i

  const body: tCreate = {
   _id: values.subject,
   ucebna: values.classroom,
   kapacita: values.capacity,
   cviceni: parseInt(values.exercise || '0'),
   nazev: values.name || '',
   tema: values.theme,
   start: new Date(
    values.startDate.toString().replace(regex, values.startTime + ':00'),
   ).valueOf(),
   konec: new Date(values.endDate.toString().replace(regex, values.endTime + ':00')).valueOf(),
   upzornit: values.notifyStudents,
  }
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/termin`)
  const cookie = await Get('stagUserTicket')
  if (cookie) {
   url.searchParams.set('ticket', cookie.value)
  }
  const res = await fetch(url.toString(), {
   method: 'POST',
   headers: fastHeaders,
   body: JSON.stringify(body),
  })

  if (res.ok) {
   toast({
    title: 'Úspěch',
    description: 'Termín byl úspěšně vypsán',
   })
   setOpen(false)
   setReload(!reload)
  } else {
   toast({
    variant: 'destructive',
    title: 'Problém',
    description: 'Něco se nepovedlo při vypisování',
   })
  }
 }

 if (loading) {
  return (
   <Button size="icon" className="fixed bottom-6 right-6 h-14 w-14 rounded-full" disabled={true}>
    <Plus className="h-6 w-6" />
   </Button>
  )
 }

 return (
  <Dialog open={open} onOpenChange={setOpen}>
   <DialogTrigger asChild>
    <Button size="icon" className="fixed bottom-6 right-6 h-14 w-14 rounded-full">
     <Plus className="h-6 w-6" />
    </Button>
   </DialogTrigger>
   <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
     <DialogTitle>Vytvořit novou událost</DialogTitle>
     <DialogDescription>
      Vyplňte detaily pro vytvoření nové události. Po dokončení klikněte na uložit.
     </DialogDescription>
    </DialogHeader>
    <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
       <FormField
        control={form.control}
        name="subject"
        render={({ field }) => (
         <FormItem>
          <FormLabel>Předmět</FormLabel>
          <Select
           onValueChange={(value) => {
            field.onChange(value)
            setSelectedSubject(predmety.find((p) => p._id === value) || null)
           }}
           defaultValue={field.value}
          >
           <FormControl>
            <SelectTrigger>
             <SelectValue placeholder="Vyberte předmět" />
            </SelectTrigger>
           </FormControl>
           <SelectContent>
            {predmety.length > 0 ? (
             predmety.map((subject: tPredmet) => (
              <SelectItem key={subject._id} value={subject._id}>
               {subject.nazev}
              </SelectItem>
             ))
            ) : (
             <SelectItem value="" disabled>
              Žádné předměty k dispozici
             </SelectItem>
            )}
           </SelectContent>
          </Select>
          <FormMessage />
         </FormItem>
        )}
       />

       <FormField
        control={form.control}
        name="exercise"
        render={({ field }) => (
         <FormItem>
          <FormLabel>Cvičení</FormLabel>
          <Select
           onValueChange={field.onChange}
           defaultValue={field.value}
           disabled={!selectedSubject || selectedSubject.nCviceni === 0}
          >
           <FormControl>
            <SelectTrigger>
             <SelectValue placeholder="Vyberte cvičení" />
            </SelectTrigger>
           </FormControl>
           <SelectContent>
            {selectedSubject && selectedSubject.nCviceni > 0 ? (
             Array.from({ length: selectedSubject.nCviceni }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
               Cvičení {i + 1}
              </SelectItem>
             ))
            ) : (
             <SelectItem value="1" disabled>
              {selectedSubject ? 'Žádná cvičení k dispozici' : 'Nejprve vyberte předmět'}
             </SelectItem>
            )}
           </SelectContent>
          </Select>
          <FormMessage />
         </FormItem>
        )}
       />
      </div>
      <FormField
       control={form.control}
       name="name"
       render={({ field }) => (
        <FormItem>
         <FormLabel>Název události</FormLabel>
         <FormControl>
          <Input
           disabled={!selectedSubject || selectedSubject.nCviceni > 0 ? true : false}
           placeholder="Prezentace"
           {...field}
          />
         </FormControl>
         <FormMessage />
        </FormItem>
       )}
      />
      <FormField
       control={form.control}
       name="theme"
       render={({ field }) => (
        <FormItem>
         <FormLabel>Téma</FormLabel>
         <FormControl>
          <Input placeholder="Stavba PC" {...field} />
         </FormControl>
         <FormMessage />
        </FormItem>
       )}
      />
      <div className="flex space-x-4">
       <FormField
        control={form.control}
        name="classroom"
        render={({ field }) => (
         <FormItem className="flex-1">
          <FormLabel>Učebna</FormLabel>
          <FormControl>
           <Input placeholder="CP-1.03" {...field} />
          </FormControl>
          <FormMessage />
         </FormItem>
        )}
       />
       <FormField
        control={form.control}
        name="capacity"
        render={({ field }) => (
         <FormItem className="flex-1">
          <FormLabel>Kapacita</FormLabel>
          <FormControl>
           <Input
            type="number"
            placeholder="20"
            {...field}
            onChange={(e) => field.onChange(+e.target.value)}
           />
          </FormControl>
          <FormMessage />
         </FormItem>
        )}
       />
      </div>
      <div className="space-y-4">
       <div className="flex space-x-4">
        <FormField
         control={form.control}
         name="startDate"
         render={({ field }) => (
          <FormItem className="flex-1">
           <FormLabel>Datum začátku</FormLabel>
           <Popover>
            <PopoverTrigger asChild>
             <FormControl>
              <Button
               variant={'outline'}
               className={cn(
                'w-full pl-3 text-left font-normal',
                !field.value && 'text-muted-foreground',
               )}
              >
               {field.value ? (
                format(field.value, 'PPP', { locale: cs })
               ) : (
                <span>Vyberte datum</span>
               )}
               <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
             </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
             <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              disabled={(date) => date < new Date() || date > new Date('2100-01-01')}
              initialFocus
             />
            </PopoverContent>
           </Popover>
           <FormMessage />
          </FormItem>
         )}
        />
        <FormField
         control={form.control}
         name="startTime"
         render={({ field }) => (
          <FormItem className="flex-1">
           <FormLabel>Čas začátku</FormLabel>
           <FormControl>
            <div className="flex">
             <Input type="time" {...field} />
            </div>
           </FormControl>
           <FormMessage />
          </FormItem>
         )}
        />
       </div>
       <div className="flex space-x-4">
        <FormField
         control={form.control}
         name="endDate"
         render={({ field }) => (
          <FormItem className="flex-1">
           <FormLabel>Datum konce</FormLabel>
           <Popover>
            <PopoverTrigger asChild>
             <FormControl>
              <Button
               variant={'outline'}
               className={cn(
                'w-full pl-3 text-left font-normal',
                !field.value && 'text-muted-foreground',
               )}
              >
               {field.value ? (
                format(field.value, 'PPP', { locale: cs })
               ) : (
                <span>Vyberte datum</span>
               )}
               <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
             </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
             <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              disabled={(date) => date < new Date() || date > new Date('2100-01-01')}
              initialFocus
             />
            </PopoverContent>
           </Popover>
           <FormMessage />
          </FormItem>
         )}
        />
        <FormField
         control={form.control}
         name="endTime"
         render={({ field }) => (
          <FormItem className="flex-1">
           <FormLabel>Čas konce</FormLabel>
           <FormControl>
            <div className="flex">
             <Input type="time" {...field} />
            </div>
           </FormControl>
           <FormMessage />
          </FormItem>
         )}
        />
       </div>
      </div>
      <FormField
       control={form.control}
       name="notifyStudents"
       render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
         <FormControl>
          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
         </FormControl>
         <div className="space-y-1 leading-none">
          <FormLabel>Upozornit studenty</FormLabel>
          <FormDescription>
           Odeslat upozornění všem zapsaným studentům o této události.
          </FormDescription>
         </div>
        </FormItem>
       )}
      />
      <DialogFooter>
       <Button type="submit">Vytvořit událost</Button>
      </DialogFooter>
     </form>
    </Form>
   </DialogContent>
  </Dialog>
 )
}
