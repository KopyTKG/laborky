'use client'
import { Get } from '@/app/actions'
import React from 'react'
import { Button, Link } from '@nextui-org/react'
import { toast, useToast } from '@/hooks/use-toast'
import { useState } from 'react'

export function Zobrazit({ id }: { id: string }) {
 return (
  <Button as={Link} href={`/termin/${id}`} color="default">
   Zobrazit
  </Button>
 )
}

export function Zapsat({
 id,
 owned,
 date,
 VolnoRender,
 CapRender,
 volno,
 setReload,
}: {
 id: string
 owned: boolean
 date: boolean
 VolnoRender: boolean
 CapRender: boolean
 volno: boolean
 setReload: React.Dispatch<React.SetStateAction<boolean>>
}) {
 const [loading, setLoading] = useState<boolean>(false)

 async function APIcall(id: string, setReload: React.Dispatch<React.SetStateAction<boolean>>) {
  try {
   setLoading(true)
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
    setLoading(false)
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
 return (
  <Button
   color={owned ? 'danger' : CapRender ? 'danger' : 'success'}
   disabled={!owned ? VolnoRender : date ? true : false}
   onClick={() => APIcall(id, setReload)}
   isLoading={loading}
  >
   {!owned && (volno ? 'Obsazeno' : 'Zapsat se')}
   {owned && (date ? 'Odepsat se' : 'Nelze se odepsat')}
  </Button>
 )
}
