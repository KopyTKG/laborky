'use client'
import {
 Button,
 Checkbox,
 Input,
 Modal,
 ModalBody,
 ModalContent,
 ModalFooter,
 ModalHeader,
 Select,
 SelectItem,
 TimeInput,
 useDisclosure,
} from '@nextui-org/react'
import React, { useLayoutEffect, useState } from 'react'
import { tPredmet } from '@/lib/types'
import { Get } from '@/app/actions'
import { BellRing, Plus } from 'lucide-react'
import { fastHeaders } from '@/lib/stag'

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

export default function Vytvor() {
 const [predmety, setPredmety] = useState<tPredmet[]>([])
 const [predmet, setPredmet] = useState<tPredmet>()
 const [cviceni, setCviceni] = useState<number>(0)
 const { isOpen, onOpen, onOpenChange } = useDisclosure()

 function handlePredmetChange(e: any) {
  const selectedValue = e.target.value
  const selectedPredmet = predmety.find((predmet) => predmet._id === selectedValue)
  if (selectedPredmet) {
   setPredmet(selectedPredmet)
  }
 }

 function handleSubmit() {
  const tema = document.getElementById('tema')
  const datum = document.getElementById('datum')
  const zacatek = document.getElementById('od')
  const konec = document.getElementById('do')
  const misto = document.getElementById('misto')
  const kapacita = document.getElementById('')
 }

 useLayoutEffect(() => {
  async function loadPredmety() {
   try {
    const data = (await fetchPredmetyData())?.predmety
    if (data) {
     setPredmety(data)
     setPredmet(data[0])
    }
   } catch (e) {
    console.error(e)
   }
  }
  loadPredmety()
 }, [])

 return (
  <>
   <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
    <ModalContent>
     {(onClose) => (
      <>
       <form onSubmit={handleSubmit}>
        <ModalHeader className="flex flex-col gap-1 text-2xl">Vypsání nového termínu</ModalHeader>
        <ModalBody>
         <SectionTitle>Vyberte předmět</SectionTitle>
         <Select
          placeholder="Vyberte předmět"
          selectionMode="single"
          onChange={handlePredmetChange}
          isRequired
         >
          {predmety.map((item: tPredmet) => (
           <SelectItem value={item._id} key={item._id}>
            {item.nazev}
           </SelectItem>
          ))}
         </Select>
         <Select
          placeholder="Vyberte cvičení"
          isRequired
          value={cviceni}
          onChange={(e) => setCviceni(parseInt(e.target.value))}
         >
          <SelectItem key={0} value={0}>
           Neurčeno
          </SelectItem>
          {Array.from({ length: predmet?.nCviceni || 0 }).map((_, index) => (
           <SelectItem key={index + 1} value={index + 1}>
            {`Cvičení ${index + 1}`}
           </SelectItem>
          ))}
         </Select>
         <Input id="tema" placeholder="Zadejte téma" isRequired />

         <SectionTitle>Místo konání</SectionTitle>
         <Input id="misto" placeholder="Zadejte místo konání" isRequired />
         <SectionTitle>Kapacita termínu</SectionTitle>
         <Input id="kapacita" type="number" placeholder="Zadejte kapacitu termínu" isRequired />
         <SectionTitle>Datum a čas konání</SectionTitle>
         <Input id="datum" type="date" placeholder="Zadejte datum a čas konání" isRequired />
         <div className="flex flex-row gap-10">
          <div className="flex flex-row items-center text-lg gap-2 w-max">
           od:
           <TimeInput id="od" hourCycle={24} granularity="minute" isRequired />
          </div>
          <div className="flex flex-row items-center text-lg gap-2 w-max">
           do:
           <TimeInput id="do" hourCycle={24} granularity="minute" isRequired />
          </div>
         </div>
         <div className="pt-8">
          <Checkbox color="warning" size="lg" defaultSelected>
           <div className="flex flex-row gap-2">
            <BellRing className="w-6" />
            <h3>Upozornit studenty</h3>
           </div>
          </Checkbox>
         </div>
        </ModalBody>
        <ModalFooter className="flex flex-row w-full justify-between">
         <Button color="danger" onPress={onClose}>
          Zrušit
         </Button>
         <Button color="primary" type="submit">
          Vytvořit
         </Button>
        </ModalFooter>
       </form>
      </>
     )}
    </ModalContent>
   </Modal>
   <Button
    variant="solid"
    isIconOnly
    onClick={onOpen}
    aria-label="Create new event"
    color="primary"
    className="fixed bottom-6 right-6"
   >
    <Plus className="w-6 h-6" />
   </Button>
  </>
 )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
 return <div className="text-lg font-bold">{children}</div>
}
