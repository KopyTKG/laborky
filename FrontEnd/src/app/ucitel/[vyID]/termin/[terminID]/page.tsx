'use client'
import { Get } from '@/app/actions'
import { fastHeaders } from '@/lib/stag'
import { tStudent, tTermin } from '@/lib/types'
import { useState, useCallback, useLayoutEffect } from 'react'

const fetchTerminData = async (id: string) => {
 try {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE}/api/termin`)
  url.searchParams.set('id', id)
  const cookie = await Get('stagUserTicket')
  if (cookie) {
   url.searchParams.set('ticket', cookie.value)
  }
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (!res.ok) {
   console.error(res.statusText)
  }
  return await res.json()
 } catch (e) {
  console.error(e)
 }
}

export default function TerminPage({ params }: { params: { terminID: string } }) {
 const [Termin, setTermin] = useState<tTermin>()
 const [Studenti, setStudenti] = useState<tStudent[]>()

 const [reload, setReload] = useState<boolean>(false)
 const [fetching, setFetching] = useState<boolean>(true)

 const fetchTermin = useCallback(async () => {
  const data = await fetchTerminData(params.terminID)
  if (data) {
   setTermin(data.termin)
   setStudenti(data.studenti)
   console.log(data)
   setReload(false)
  }

  setFetching(false)
 }, [params.terminID])

 useLayoutEffect(() => {
  fetchTermin()
 }, [reload, fetchTermin])
 return <h1>{params.terminID}</h1>
}
