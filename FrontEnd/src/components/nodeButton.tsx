'use client'
import { Get } from '@/app/actions'
import React, { useContext } from 'react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ReloadCtx } from '@/contexts/ReloadProvider'

export function Zobrazit({ id }: { id: string }) {
 const router = useRouter()
 return <Button onClick={() => router.push(`/termin/${id}`)}>Zobrazit</Button>
}

export function Zapsat({
 id,
 owned,
 date,
 VolnoRender,
 CapRender,
 volno,
}: {
 id: string
 owned: boolean
 date: boolean
 VolnoRender: boolean
 CapRender: boolean
 volno: boolean
}) {
 const context = useContext(ReloadCtx)
 if (!context) {
  throw new Error('Missing ReloadProvider')
 }

 const [reload, setReload] = context

 async function APIcall(id: string, setReload: React.Dispatch<React.SetStateAction<boolean>>) {
  try {
   const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/zapsat`)
   url.searchParams.set('id', id)
   url.searchParams.set('type', !owned ? 'zapsat' : 'odhlasit')
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
   if (res.status != 200 && res.status != 409) {
    window.location.href = '/logout'
   } else {
    setReload(true)
    if (res.status === 200) {
     toast({
      title: 'Akce provedena',
      description: !owned ? 'Byl jsi zapsán na termín' : 'Byl jsi odhlášen z termínu',
     })
    } else {
     toast({
      title: 'Něco se nepovedlo',
      description: `Serveru se něco nelíbí`,
     })
    }
   }
  } catch (e) {
   console.error(e)
  }
 }

 const mojeCheck = (owned && !date)? true : false
 const zapsatCheck = (!owned && VolnoRender)? true: false
 return (
  <Button
   variant={owned ? 'destructive' : CapRender ? 'destructive' : 'default'}
   disabled={owned? mojeCheck: zapsatCheck}
   onClick={() => APIcall(id, setReload)}
  >
   {!owned && (volno ? 'Obsazeno' : 'Zapsat se')}
   {owned && ('Odepsat se')}
  </Button>
 )
}
