'use client'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
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
import { DateTime } from '@/lib/functions'
import { DefaultForm, DefaultPredmet, FormCtx } from '@/contexts/FormProvider'

const formSchema = z.object({
 _id: z.string().min(1, { message: 'Předmět je povinný' }),
 cviceni: z.string().optional(),
 nazev: z.string().optional(),
 tema: z.string().min(1, { message: 'Téma je povinné' }),
 ucebna: z.string().min(1, { message: 'Učebna je povinná' }),
 kapacita: z.number().min(1, { message: 'Kapacita musí být alespoň 1' }),
 startDatum: z.date({ required_error: 'Datum začátku je povinné' }),
 startCas: z
  .string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Neplatný formát času' }),
 konecDatum: z.date({ required_error: 'Datum konce je povinné' }),
 konecCas: z
  .string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Neplatný formát času' }),
 upozornit: z.boolean().default(true),
})

export default function Formular() {
 const { toast } = useToast()

 const context = useContext(ReloadCtx)
 const FormContext = useContext(FormCtx)

 if (!context || !FormContext) {
  throw new Error('Missing ReloadProvider or FormProvider')
 }

 const [reload, setReload] = context
 const { open, setOpen, predmety, formData, predmet, setPredmet, terminID } = FormContext

 const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: DefaultForm,
  values: formData,
 })

 async function onSubmit(values: z.infer<typeof formSchema>) {
  const body: tCreate = {
   _id: values._id,
   ucebna: values.ucebna,
   kapacita: values.kapacita,
   cviceni: parseInt(values.cviceni || '0'),
   nazev: values.nazev || '',
   tema: values.tema,
   start: DateTime(values.startDatum, values.startCas),
   konec: DateTime(values.konecDatum, values.konecCas),
   upzornit: values.upozornit,
  }
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/termin`)
  const cookie = await Get('stagUserTicket')
  if (cookie) {
   url.searchParams.set('ticket', cookie.value)
  }
  if (terminID) {
   url.searchParams.set('id', terminID)
  }
  try {
   const res = await fetch(url.toString(), {
    method: terminID ? 'PATCH' : 'POST',
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
    form.reset()
   } else {
    toast({
     variant: 'destructive',
     title: 'Problém',
     description: 'Něco se nepovedlo při vypisování',
    })
   }
  } catch (e: any) {
   console.error(e)
   toast({
    variant: 'destructive',
    title: 'Problém',
    description: 'Něco se nepovedlo při vypisování',
   })
  }
 }

 return (
  <Dialog open={open} onOpenChange={setOpen}>
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
        name="_id"
        render={({ field }) => (
         <FormItem>
          <FormLabel>Předmět</FormLabel>
          <Select
           onValueChange={(value) => {
            field.onChange(value)
            setPredmet(predmety.find((p) => p._id === value) || DefaultPredmet)
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
        name="cviceni"
        render={({ field }) => (
         <FormItem>
          <FormLabel>Cvičení</FormLabel>
          <Select
           onValueChange={field.onChange}
           defaultValue={field.value}
           disabled={!predmet || predmet.nCviceni === 0}
          >
           <FormControl>
            <SelectTrigger>
             <SelectValue placeholder="Vyberte cvičení" />
            </SelectTrigger>
           </FormControl>
           <SelectContent>
            {predmet && predmet.nCviceni > 0 ? (
             Array.from({ length: predmet.nCviceni }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
               Cvičení {i + 1}
              </SelectItem>
             ))
            ) : (
             <SelectItem value="1" disabled>
              {predmet ? 'Žádná cvičení k dispozici' : 'Nejprve vyberte předmět'}
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
       name="nazev"
       render={({ field }) => (
        <FormItem>
         <FormLabel>Název události</FormLabel>
         <FormControl>
          <Input
           disabled={!predmet || predmet.nCviceni > 0 ? true : false}
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
       name="tema"
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
        name="ucebna"
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
        name="kapacita"
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
         name="startDatum"
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
              disabled={(date) => date > new Date('2100-01-01')}
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
         name="startCas"
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
         name="konecDatum"
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
              disabled={(date) =>
               date < form.getValues().startDatum || date > new Date('2100-01-01')
              }
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
         name="konecCas"
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
       name="upozornit"
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