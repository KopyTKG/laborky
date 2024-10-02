'use client'
import Icon from '@/components/icon'
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
 useDisclosure,
} from '@nextui-org/react'
import React, { useLayoutEffect, useState } from 'react'
import { Button as Btn } from '@/components/ui/button'
import { tPredmetInfo } from '@/lib/types'
import { Get } from '@/app/actions'

const Skupiny = ['ZPS', 'ki/ZSP', 'ASD', 'QEEE', 'Neurčeno']
export default function Vytvor() {
 const [predmety, setPredmety] = useState<tPredmetInfo[]>([])
 const [skupiny, setSkupiny] = useState<string[]>([])
 const [predmet, setPredmet] = useState<number>(-1)
 const { isOpen, onOpen, onOpenChange } = useDisclosure()

 useLayoutEffect(() => {
  const fetchTerminy = async () => {
   try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/predmety`)
    url.searchParams.set('t', 'vypsane')
    const cookie = await Get('stagUserTicket')
    if (cookie) {
     url.searchParams.set('ticket', cookie.value)
    }
    const headers = {
     Accept: 'application/json',
     'Content-Type': 'application/json',
     Connection: 'keep-alive',
     'Accept-Origin': `${process.env.NEXT_PUBLIC_BASE}`,
    }
    const res = await fetch(url.toString(), { method: 'GET', headers })
    if (res.status != 200) {
     window.location.reload()
    } else if (res.status == 200) {
     let jsonParsed = await res.json()
     setPredmety(jsonParsed.data)
    }
   } catch {
    window.location.href = '/logout'
   }
  }
  fetchTerminy()
 }, [])

 return (
  <>
   <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
    <ModalContent>
     {(onClose) => (
      <>
       <form>
        <ModalHeader className="flex flex-col gap-1 text-2xl">Vypsání nového termínu</ModalHeader>
        <ModalBody>
         <SectionTitle>Vyberte předmět</SectionTitle>
         <Select
          placeholder="Vyberte předmět"
          isRequired
          onChange={(e) => {
           setPredmet(predmety.findIndex((item) => item._id === e.target.value))
          }}
         >
          {predmety.map((item, key) => (
           <SelectItem value={key} key={item._id}>
            {item.zkratka}
           </SelectItem>
          ))}
         </Select>
         {predmet < 0 || predmety[predmet].zkratka === 'Nic' ? (
          <Input placeholder="Zadejte téma" isRequired />
         ) : (
          <Select placeholder="Vyberte cvičení" isRequired>
           {Array.from({ length: predmety[predmet].nCviceni }, (_, index) => (
            <SelectItem key={`${predmet}-${index}`} value={index + 1}>
             {`Cvičení ${index + 1}`}
            </SelectItem>
           ))}
          </Select>
         )}
         <SectionTitle>Místo konání</SectionTitle>
         <Input placeholder="Zadejte místo konání" isRequired />
         <SectionTitle>Datum a čas konání</SectionTitle>
         <Input type="date" placeholder="Zadejte datum a čas konání" isRequired />
         <div className="flex flex-row gap-10 justify-between">
          <div className="flex flex-row items-center text-lg gap-2 w-full">
           od:
           <Input type="time" placeholder="Zadejte datum a čas konání" isRequired />
          </div>
          <div className="flex flex-row items-center text-lg gap-2 w-full">
           do:
           <Input type="time" placeholder="Zadejte datum a čas konání" isRequired />
          </div>
         </div>
         <SectionTitle>Výběr cílové skupiny</SectionTitle>
         <Select placeholder="Vyberte skupinu" selectionMode="multiple" isRequired>
          {Skupiny.map((item) => (
           <SelectItem value={item} key={item}>
            {item}
           </SelectItem>
          ))}
         </Select>
         <div className="pt-8">
          <Checkbox color="warning" size="lg" defaultSelected>
           <div className="flex flex-row gap-2">
            <Icon name="bell-ring" className="w-6" />
            <h3>Upozornit studenty</h3>
           </div>
          </Checkbox>
         </div>
        </ModalBody>
        <ModalFooter className="flex flex-row w-full justify-between">
         <Button color="primary" type="submit">
          Vytvořit
         </Button>
         <Button color="danger" onPress={onClose}>
          Zrušit
         </Button>
        </ModalFooter>
       </form>
      </>
     )}
    </ModalContent>
   </Modal>
   <Btn
    variant="highlight"
    onClick={onOpen}
    aria-label="Create new event"
    className="fixed bottom-6 right-6"
   >
    <Icon name="plus" className="w-6 h-6" />
   </Btn>
  </>
 )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
 return <div className="text-lg font-bold">{children}</div>
}
