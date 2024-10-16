'use client'
import React, { createContext, useState, Dispatch, SetStateAction } from 'react'

type FilterContextType = [string[], Dispatch<SetStateAction<string[]>>]

export const FilterCtx = createContext<FilterContextType | undefined>(undefined)

export default function FilterProvider({ children }: { children: React.ReactNode }) {
 const [filter, setFilter] = useState<string[]>([])
 return <FilterCtx.Provider value={[filter, setFilter]}>{children}</FilterCtx.Provider>
}
