'use client'
import React, { createContext, useState, Dispatch, SetStateAction } from 'react'

type AdminContextType = {
 open: boolean
 setOpen: Dispatch<SetStateAction<boolean>>
 storage: tPredmetBody
 setStorage: Dispatch<SetStateAction<tPredmetBody>>
}

export type tPredmetBody = {
	kod?: string
	zkratka: string
	katedra: string
	cviceni: string
}

export const DefaultPredmet: tPredmetBody = {
	kod: '',
	zkratka: '',
	katedra: '',
	cviceni: ''
}


export const AdminCtx = createContext<AdminContextType | undefined>(undefined)

export default function AdminProvider({ children }: { children: React.ReactNode }) {
 const [open, setOpen] = useState<boolean>(false)
 const [storage, setStorage] = useState<tPredmetBody>(DefaultPredmet)

 return (
  <AdminCtx.Provider
   value={{
    open,
    setOpen,
    storage,
    setStorage
   }}
  >
   {children}
  </AdminCtx.Provider>
 )
}
