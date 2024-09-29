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
import React, { useState } from 'react'
import { Button as Btn } from '@/components/ui/button'

const Predmety = ['PCA', 'ZPS', 'Neurčeno']
const Skupiny = ['ZPS', 'ki/ZSP', 'ASD', 'QEEE', 'Neurčeno']
export default function Vytvor() {
 const [predmet, setPredmet] = useState('')
 const { isOpen, onOpen, onOpenChange } = useDisclosure()
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
           setPredmet(e.target.value)
          }}
         >
          {Predmety.map((item) => (
           <SelectItem value={item} key={item}>
            {item}
           </SelectItem>
          ))}
         </Select>
         {!predmet ? null : predmet === 'Neurčeno' ? (
          <Input placeholder="Zadejte téma" isRequired />
         ) : (
          <Select placeholder="Vyberte cvičení" isRequired>
           <SelectItem key={predmet + '1'} value="1">
            Cvičeni 1
           </SelectItem>
           <SelectItem key={predmet + '2'} value="2">
            Cvičeni 2
           </SelectItem>
           <SelectItem key={predmet + '3'} value="3">
            Cvičeni 3
           </SelectItem>
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
