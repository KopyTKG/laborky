'use client'
import { useEffect } from 'react'
import { setStag } from '@/app/actions'

export default function Home() {
 useEffect(() => {
  const redirectUrl = `https://stag-demo.zcu.cz/ws/login?originalURL=${process.env.NEXT_PUBLIC_BASE}/login&onlyMainLoginMethod=1`
  const searchParams = new URLSearchParams(window.location.search)
  const params = {
   stagUserTicket: searchParams.get('stagUserTicket'),
   stagUserInfo: searchParams.get('stagUserInfo'),
  }
  setStag(params).then(() => {
   if (params.stagUserTicket != null && params.stagUserInfo != null) {
    // call API to check if user exists
    const url = `${process.env.NEXT_PUBLIC_BASE}/api/user?ticket=${params.stagUserTicket}`
    const headers = {
     Accept: 'application/json',
     'Content-Type': 'application/json',
     Connection: 'keep-alive',
     'Accept-Origin': 'https://stag-demo.zcu.cz',
    }
    fetch(url, { method: 'GET', headers }).then((data) => {
     if (data.status != 200) {
      window.location.href = '/logout'
     } else {
      window.location.href = '/'
     }
    })
   } else if (!window.location.href.includes(redirectUrl)) {
    // Redirect the user to the specified URL
    window.location.href = redirectUrl
   }
  })
 }, [])

 return (
  <main>
   <div className="container-row">
    <h1>Login</h1>
   </div>
  </main>
 )
}
