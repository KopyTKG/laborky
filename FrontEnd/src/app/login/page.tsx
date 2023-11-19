'use client'
import { useEffect } from 'react'
import { setStag } from '../actions'

export default function Home() {
 //const {stag, setStag} = useAuth();
 useEffect(() => {
  const redirectUrl = `https://ws.ujep.cz/ws/login?originalURL=${process.env.NEXT_PUBLIC_BASE}/login&onlyMainLoginMethod=1`
  const searchParams = new URLSearchParams(window.location.search)
  const params = {
   stagUserTicket: searchParams.get('stagUserTicket'),
   stagUserName: searchParams.get('stagUserName'),
   stagUserRole: searchParams.get('stagUserRole'),
   stagUserInfo: searchParams.get('stagUserInfo'),
  }
  setStag(params).then(() => {
   if (params.stagUserRole != null) {
    window.location.href = '/'
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
