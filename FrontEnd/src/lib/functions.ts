import { Get } from '@/app/actions'
import { tPredmet } from '@/lib/types'
import { fastHeaders } from '@/lib/stag'

export async function fetchPredmetyData(): Promise<tPredmet[] | undefined> {
 try {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/predmety`)
  const cookie = await Get('stagUserTicket')
  if (cookie) {
   url.searchParams.set('ticket', cookie.value)
  }
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (!res.ok) {
   console.error(res.statusText)
   return undefined
  } else if (res.ok) {
   const data = await res.json()
   return data && data?.predmety ? (data?.predmety as tPredmet[]) : undefined
  }
 } catch (e) {
  console.error(e)
  return undefined
 }
}

