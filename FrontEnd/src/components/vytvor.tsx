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
 SharedSelection,
 TimeInput,
 TimeInputValue,
 useDisclosure,
} from '@nextui-org/react'
import React, { useLayoutEffect, useState } from 'react'
import { tPredmet, tTerminBody } from '@/lib/types'
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
 const { isOpen, onOpen, onOpenChange } = useDisclosure()
 const [predmety, setPredmety] = useState<tPredmet[]>([])
 const [formData, setFormData] = useState<tTerminBody>({
  predmet: { _id: '', nazev: '', nCviceni: 0 },
  cviceni: 0,
  nazev: '',
  tema: '',
  ucebna: '',
  kapacita: 0,
  datum: '',
  start: { hour: 0, minute: 0, second: 0, millisecond: 0 } as TimeInputValue,
  end: { hour: 0, minute: 0, second: 0, millisecond: 0 } as TimeInputValue,
 })

 const [notFilled, setnotFilled] = useState({
  nazev: true,
  tema: true,
  ucebna: true,
  kapacita: true,
  datum: true,
  start: true,
  end: true,
 })
 const [isLoading, setIsLoading] = useState<boolean>(true)
 const [submit, setSubmit] = useState<boolean>(false)

 const handleChange = (field: string, value: any) => {
  setFormData((prev) => ({ ...prev, [field]: value }))
  if (value != '') {
   setnotFilled((prev) => ({ ...prev, [field]: false }))
  } else {
   setnotFilled((prev) => ({ ...prev, [field]: true }))
  }
  isFilled()
 }

 const isFilled = () => {
  if (
   !notFilled.nazev &&
   !notFilled.tema &&
   !notFilled.end &&
   !notFilled.start &&
   !notFilled.datum &&
   !notFilled.kapacita &&
   !notFilled.ucebna
  ) {
   setSubmit(true)
  } else {
   setSubmit(false)
  }
 }

 const handlePredmetChange = (e: SharedSelection) => {
  const selectedValue = e.currentKey
  const selectedPredmet = predmety.find((predmet) => predmet._id === selectedValue)
  if (selectedPredmet) {
   handleChange('predmet', selectedPredmet)
  }
  if (selectedPredmet?.nCviceni != 0) {
   setnotFilled((prev) => ({ ...prev, ['nazev']: false }))
  } else if (selectedPredmet?.nCviceni == 0 && formData.nazev == '') {
   setnotFilled((prev) => ({ ...prev, ['nazev']: true }))
  }
 }

 const handleSubmit = async () => {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/cTermin`)
  const cookie = await Get('stagUserTicket')
  if (cookie) {
   url.searchParams.set('ticket', cookie.value)
  }
  const res = await fetch(url.toString(), {
   method: 'POST',
   headers: fastHeaders,
   body: JSON.stringify(formData),
  })

  if (res) {
   alert(res.statusText)
  }
 }

 useLayoutEffect(() => {
  const loadPredmety = async () => {
   try {
    const data = (await fetchPredmetyData())?.predmety
    if (data) {
     setPredmety(data)
     handleChange('predmet', data[0])
     setIsLoading(false)
    }
   } catch (e) {
    console.error(e)
   }
  }
  loadPredmety()
 }, [])

 const { predmet, cviceni, nazev, tema, ucebna, kapacita, datum, start, end } = formData
 const isCviceniDisabled = predmet.nCviceni === 0
 const isNazevDisabled = !isCviceniDisabled

 return (
  <>
   <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
    <ModalContent>
     {(onClose) => (
      <>
       <form>
        <ModalHeader className="flex flex-col gap-1 text-2xl w-full text-center">
         Vypsání nového termínu
        </ModalHeader>
        <ModalBody>
         <div className="grid grid-cols-2 gap-10">
          <SectionTitle>Předmět</SectionTitle>
          <SectionTitle className={predmet.nCviceni == 0 ? 'text-gray-500/50' : ''}>
           Cvičení
          </SectionTitle>
         </div>
         <div className="grid grid-cols-2 gap-10">
          <Select
           placeholder="Vyberte předmět"
           selectionMode="single"
           onSelectionChange={handlePredmetChange}
           isRequired={true}
           defaultSelectedKeys={[predmet._id]}
           isLoading={isLoading}
          >
           {predmety.map((item: tPredmet) => (
            <SelectItem value={item._id} key={item._id}>
             {item.nazev}
            </SelectItem>
           ))}
          </Select>
          <Select
           placeholder="Vyberte cvičení"
           value={cviceni}
           onSelectionChange={(e) => handleChange('cviceni', parseInt(e.currentKey || '0'))}
           isDisabled={predmet.nCviceni == 0}
           isLoading={isLoading}
           isRequired={predmet.nCviceni != 0}
          >
           {predmet.nCviceni == 0 ? (
            <SelectItem key={0} value={0}>
             Neurčeno
            </SelectItem>
           ) : (
            Array.from({ length: predmet.nCviceni || 0 }).map((_, index) => (
             <SelectItem key={index + 1} value={index + 1}>
              {`Cvičení ${index + 1}`}
             </SelectItem>
            ))
           )}
          </Select>
         </div>

         <SectionTitle className={predmet.nCviceni != 0 ? 'text-gray-500/50' : ''}>
          Název termínu
         </SectionTitle>
         <Input
          id="nazev"
          placeholder="Prezentace"
          isDisabled={predmet.nCviceni != 0}
          isRequired={predmet.nCviceni == 0}
          value={nazev}
          onValueChange={(value) => handleChange('nazev', value)}
          isInvalid={notFilled.nazev}
         />
         <SectionTitle>Téma termínu</SectionTitle>
         <Input
          id="tema"
          placeholder="Stavba PC"
          isRequired={true}
          value={tema}
          onValueChange={(value) => handleChange('tema', value)}
          isInvalid={notFilled.tema}
         />

         <SectionTitle className="w-full grid grid-cols-2 gap-10">
          <span>Učebna</span>
          <span>Kapacita</span>
         </SectionTitle>
         <div className="grid grid-cols-2 gap-10 w-full">
          <Input
           id="misto"
           placeholder="CP-1.03"
           isRequired={true}
           value={ucebna}
           onValueChange={(value) => handleChange('ucebna', value)}
           isInvalid={notFilled.ucebna}
          />
          <Input
           id="kapacita"
           type="number"
           placeholder="20"
           isRequired={true}
           value={kapacita.toString()}
           onValueChange={(value) => handleChange('kapacita', parseInt(value))}
           isInvalid={notFilled.kapacita}
          />
         </div>
         <SectionTitle>Datum a čas konání</SectionTitle>
         <div className="flex flex-row gap-2">
          <Input
           id="datum"
           type="date"
           placeholder="Zadejte datum a čas konání"
           isRequired={true}
           value={datum}
           onValueChange={(value) => handleChange('datum', value)}
           isInvalid={notFilled.datum}
          />
          <div className="flex flex-row gap-2">
           <div className="flex flex-row items-center text-lg gap-2 w-max">
            od:
            <TimeInput
             id="od"
             hourCycle={24}
             granularity="minute"
             isRequired={true}
             value={start}
             onChange={(value) => handleChange('start', value)}
             isInvalid={notFilled.start}
            />
           </div>
           <div className="flex flex-row items-center text-lg gap-2 w-max">
            do:
            <TimeInput
             id="do"
             hourCycle={24}
             granularity="minute"
             isRequired={true}
             value={end}
             onChange={(value) => handleChange('end', value)}
             isInvalid={notFilled.end}
            />
           </div>
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
         <Button color="primary" type="button" onClick={handleSubmit} isDisabled={!submit}>
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

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
 return <div className={`text - lg font-bold ${className}`}> {children}</div>
}
