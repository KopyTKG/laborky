'use client'
import { useEffect } from 'react'
import { deleteParam } from '@/app/actions'

export default function Home() {
 useEffect(() => {
  deleteParam('stagUserInfo').then(() => {
   window.location.href = '/'
  })
 }, [])

 return <main></main>
}
