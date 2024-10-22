'use client'
import { useState, useLayoutEffect, useContext } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DefaultForm, FormCtx } from '@/contexts/FormProvider'
import { fetchPredmetyData } from '@/lib/functions'

export function Vytvor() {
 const [loading, setLoading] = useState<boolean>(true)

 const context = useContext(FormCtx)

 if (!context) {
  throw new Error('Missing FormProvider')
 }

 const { setOpen, setPredmety, setFormData, setType, predmety } = context

 useLayoutEffect(() => {
  const loadPredmety = async () => {
   try {
    const data = await fetchPredmetyData()
    if (data) {
     setPredmety(data)
     setLoading(false)
    }
   } catch (e) {
    console.error(e)
   }
  }
  loadPredmety()
 }, [])

 return (
  <Button
   size="icon"
   className="fixed bottom-6 right-6 h-14 w-14 rounded-full"
   disabled={loading || predmety.length == 0 }
   onClick={() => {
    setOpen(true)
    setFormData(DefaultForm)
    setType('create')
   }}
  >
   <Plus className="h-6 w-6" />
  </Button>
 )
}
