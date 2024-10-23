'use client'
import { useState, useLayoutEffect, useContext } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DefaultForm, FormCtx } from '@/contexts/FormProvider'
import { fetchPredmetyData } from '@/lib/functions'
import { ReloadCtx } from '@/contexts/ReloadProvider'

export function Vytvor() {
 const [loading, setLoading] = useState<boolean>(true)

 const Fcontext = useContext(FormCtx)
 const Rcontext = useContext(ReloadCtx)
 if (!Fcontext || !Rcontext) {
  throw new Error('Missing FormProvider or ReloadProvider')
 }

 const { setOpen, setPredmety, setFormData, setType, predmety } = Fcontext
 const [reload, _] = Rcontext

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
 }, [reload])

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

