'use client'
import { useEffect } from 'react'
import { deleteParam, Get } from '@/app/actions'

export default function Home() {
 useEffect(() => {
  const logout = async () => {
   try {
    const ticket = (await Get('stagUserTicket'))?.value || ''

    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/invalidate`)
    url.searchParams.set('ticket', ticket)
    const res = await fetch(url.toString(), { method: 'GET' })

    if (res) {
     await deleteParam('stagUserTicket')
     window.location.href = '/'
    }
   } catch (e) {
    console.error(e)
    await deleteParam('stagUserTicket')
    window.location.href = '/'
   }
  }
  logout()
 }, [])

 return <main></main>
}
