'use client'
import React, { createContext, useState, Dispatch, SetStateAction } from 'react'

type ReloadContextType = [boolean, Dispatch<SetStateAction<boolean>>]

export const ReloadCtx = createContext<ReloadContextType | undefined>(undefined)

export default function ReloadProvider({ children }: { children: React.ReactNode }) {
 const [reload, setReload] = useState<boolean>(false)
 return <ReloadCtx.Provider value={[reload, setReload]}>{children}</ReloadCtx.Provider>
}
