'use client'
import { Header } from '@/components/ui/header'
import React, { use, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Get } from '@/app/actions'
import { fastHeaders } from '@/lib/stag'
import { useToast } from '@/hooks/use-toast'
import { tPredmetSekce, tStudent } from '@/lib/types'
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from '@/components/ui/table'
import { Chip } from '@/components/ui/chip'
import { Check } from 'lucide-react'

const formSchema = z.object({
 id_stud: z.string().min(6, { message: 'osČíslo je povinný' }),
})

export default function Page() {
 const [student, setStudent] = useState<tStudent>({
  osCislo: '',
  jmeno: '',
  prijmeni: '',
  email: '',
 })
 const [predmety, setPredmety] = useState<tPredmetSekce[]>([])

 const { toast } = useToast()

 const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { id_stud: '' },
 })

 async function onSubmit(values: z.infer<typeof formSchema>) {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/hledat`)
  const cookie = await Get('stagUserTicket')
  if (cookie) {
   url.searchParams.set('ticket', cookie.value)
  }
  url.searchParams.set('id_stud', values.id_stud)

  try {
   const res = await fetch(url.toString(), {
    method: 'GET',
    headers: fastHeaders,
    redirect: 'manual',
   })
   if (!res.ok) {
    toast({
     title: 'Hledání se nepovedlo',
     description: 'Server nedokázal dokončit hledání',
     variant: 'destructive',
    })
   } else {
    const data = (await res.json()) as { data: tPredmetSekce[]; info: tStudent }
    setPredmety(data.data)
    setStudent(data.info)
   }
  } catch (e) {
   console.error(e)
  }
 }

 return (
  <section className="w-full grid grid-cols-[49.5%_1%_49.5%] gap-4 min-h-[90svh]">
   <div className="flex flex-col w-full gap-10">
    <Header underline="fade">Hlednání studenta</Header>
    <Form {...form}>
     <form className="w-max mx-auto" onSubmit={form.handleSubmit(onSubmit)}>
      <FormItem className="flex flex-row gap-4">
       <FormField
        control={form.control}
        name="id_stud"
        render={({ field }) => (
         <FormItem className="flex flex-col">
          <FormLabel className="text-xl">Zadejte osobní číslo studenta</FormLabel>
          <FormControl>
           <Input placeholder="např.: Fxxxxx" {...field} />
          </FormControl>
          <FormMessage />
         </FormItem>
        )}
       />
       <Button className="self-end" type="submit">
        Vyhledat
       </Button>
      </FormItem>
     </form>
    </Form>
   </div>
   <Divider orientation="vertical" variant="fade" />
   <div className="flex flex-col gap-10">
    <Header underline="fade">Student</Header>
    <Table>
     <TableHeader>
      <TableRow>
       <TableHead>Osobní číslo</TableHead>
       <TableHead>Jméno</TableHead>
       <TableHead>Příjmení</TableHead>
       <TableHead>Email</TableHead>
      </TableRow>
     </TableHeader>
     <TableBody>
      {student && (
       <TableRow key={student.osCislo}>
        <TableCell className="font-medium">{student.osCislo}</TableCell>
        <TableCell>{student.jmeno}</TableCell>
        <TableCell>{student.prijmeni}</TableCell>
        <TableCell>{student.email}</TableCell>
       </TableRow>
      )}
     </TableBody>
    </Table>
    {predmety &&
     predmety.map((predmet: tPredmetSekce, key: number) => {
      return (
       <div className="mb-3" key={predmet.nazev}>
        <div className="w-full flex flex-row justify-between">
         <h3 className="font-bold text-xl ">{predmet.nazev}</h3>
         <Button variant="ghost" size="sm" className="text-xl font-bold text-green-500">
          <Check className="w-8" /> 
         </Button>
        </div>
        <div className="w-full h-max rounded-2xl flex flex-col dark:bg-zinc-950 dark:text-stone-50 border-1 border-stone-300  shadow-md dark:border-zinc-800 dark:shadow-neutral-950">
         {predmet.cviceni.map((datum: any, key: number) => {
          return (
           <>
            <div
             key={datum.toLocaleString() + key}
             className={`w-full h-full flex flex-row justify-between p-3 bg-gradient-to-l ${key === 0 ? `rounded-t-xl` : key === predmet.cviceni.length - 1 ? 'rounded-b-xl' : ''} ${!datum ? 'from-red-500/15 to-transparent' : 'from-lime-500/15 to-transparent'}`}
            >
             <span className="text-lg">{`Laboratorní cvičení ${key + 1}`}</span>
             <Chip type={datum ? 'success' : 'danger'}>
              {datum ? new Date(datum).toLocaleDateString() : 'nesplnil'}
             </Chip>
            </div>
            {key < predmet.cviceni.length - 1 && <Divider margin="my0" />}
           </>
          )
         })}
        </div>
        {key < predmety.length - 1 && <Divider margin="my4" variant="ghost" />}
       </div>
      )
     })}
   </div>
  </section>
 )
}
