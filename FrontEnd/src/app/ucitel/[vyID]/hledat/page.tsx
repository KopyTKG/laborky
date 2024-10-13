'use client'
import { Header } from '@/components/ui/header'
import React from 'react'
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

const formSchema = z.object({
 id_stud: z.string().min(6, { message: 'osČíslo je povinný' }),
})

export default function Page() {
 const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { id_stud: '' },
 })

 async function onSubmit(values: z.infer<typeof formSchema>) {
  console.log(values)
 }
 return (
  <section className="w-full grid grid-cols-[49.5%_1%_49.5%] gap-4 min-h-[90svh]">
   <div className="flex flex-col w-full gap-4">
    <Header underline="fade">Hlednání studenta</Header>
    <Form {...form}>
     <form className="w-max mx-auto" onSubmit={form.handleSubmit(onSubmit)}>
      <FormItem className="flex flex-row gap-4">
       <FormField
        control={form.control}
        name="id_stud"
        render={({ field }) => (
         <FormItem className='flex flex-col'>
          <FormLabel className="text-xl">Zadejte osobní číslo studenta</FormLabel>
          <FormControl>
           <Input placeholder="např.: Fxxxxx" {...field} />
          </FormControl>
          <FormMessage />
         </FormItem>
        )}
       />
       <Button className="self-end" type="submit">Vyhledat</Button>
      </FormItem>
     </form>
    </Form>
   </div>
   <Divider orientation="vertical" variant="fade" />
   <div>
    <Header underline="fade">Student</Header>
   </div>
  </section>
 )
}
