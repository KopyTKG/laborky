'use client'
import { useEffect, useState } from 'react'
import { Get, deleteParam } from './actions'
import { Button } from '@nextui-org/react'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { base64ToText } from '@/middleware'

function User() {
 const [osCislo, setOsCislo] = useState<any>()
 useEffect(() => {
  try {
   Get('stagUserInfo').then((raw) => {
    let userInfo = base64ToText(raw?.value || '')
    setOsCislo(userInfo?.stagUserInfo[0].userName)
   })
  } catch (e) {
   setOsCislo('F-----')
  }
 }, [osCislo])

 if (!osCislo) {
  return <>F-----</>
 } else {
  return <>{osCislo}</>
 }
}

function Logout() {
 function logout() {
  deleteParam('stagUserInfo').then(() => {
   window.location.href = '/'
  })
 }
 return (
  <Button
   color="danger"
   onClick={logout}
   endContent={<ArrowRightOnRectangleIcon className="w-5" />}>
   Odhlásit se
  </Button>
 )
}

export { User, Logout }
