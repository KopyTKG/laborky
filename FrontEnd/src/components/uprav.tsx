'use client'
import { fetchPredmetyData } from '@/lib/functions'
import React, { useLayoutEffect, useContext } from 'react'




export default function Uprav({ id }: { id: string }) {
 useLayoutEffect(() => {
  const loadPredmety = async () => {
   try {
    const data = (await fetchPredmetyData())
    if (data) {
    }
   } catch (e) {
    console.error(e)
   }
  }
  loadPredmety()
 }, [])

 return <></>
}
