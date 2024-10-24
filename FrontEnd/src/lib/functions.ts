import { Get } from '@/app/actions'
import { tPredmet, tUser } from '@/lib/types'
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

export function DateTime(date: Date, time: string): number {
 const regex = /[0-2][0-9]:[0-6][0-9]:[0-6][0-9]/i
 return new Date(date.toJSON().replace(regex, time + ':00')).valueOf()
}

export function Time(timestamp: number): string {
 const datetime = new Date(timestamp)
 return `${datetime.getHours().toString().padStart(2, '0')}:${datetime.getMinutes().toString().padStart(2, '0')}`
}

export function isStudent(info: tUser): boolean {
 return info.role.includes('ST')
}

export function isAdmin(info: tUser): boolean {
 return info.role.includes('KA')
}

export function addDays(date: Date, days: number) {
 let result = new Date(date)
 result.setDate(result.getDate() + days)
 return result
}

export function addHours(date: Date, hours: number) {
 let result = new Date(date)
 result.setHours(result.getHours() + hours)
 return result
}
