'use client'
import { tForm, tPredmet } from '@/lib/types'
import React, { createContext, useState, Dispatch, SetStateAction } from 'react'

type FormContextType = {
 open: boolean
 setOpen: Dispatch<SetStateAction<boolean>>
 predmety: tPredmet[]
 setPredmety: Dispatch<SetStateAction<tPredmet[]>>
 formData: tForm
 setFormData: Dispatch<SetStateAction<tForm>>
 predmet: tPredmet
 setPredmet: Dispatch<SetStateAction<tPredmet>>
 terminID: string
 setTerminID: Dispatch<SetStateAction<string>>
}

export const DefaultForm: tForm = {
 _id: '',
 cviceni: '',
 nazev: '',
 tema: '',
 ucebna: '',
 kapacita: 0,
 startDatum: new Date(),
 startCas: '',
 konecDatum: new Date(),
 konecCas: '',
 upozornit: true,
}

export const DefaultPredmet: tPredmet = {
 _id: '',
 nazev: '',
 nCviceni: 0,
}

export const FormCtx = createContext<FormContextType | undefined>(undefined)

export default function FormProvider({ children }: { children: React.ReactNode }) {
 const [open, setOpen] = useState<boolean>(false)

 const [predmety, setPredmety] = useState<tPredmet[]>([])
 const [formData, setFormData] = useState<tForm>(DefaultForm)
 const [predmet, setPredmet] = useState<tPredmet>(DefaultPredmet)
 const [terminID, setTerminID] = useState<string>('')
 return (
  <FormCtx.Provider
   value={{
    open,
    setOpen,
    predmety,
    setPredmety,
    formData,
    setFormData,
    predmet,
    setPredmet,
    terminID,
    setTerminID,
   }}
  >
   {children}
  </FormCtx.Provider>
 )
}
