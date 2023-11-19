'use client'
import React from 'react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { Switch } from '@nextui-org/react'
import { useEffect, useState } from 'react'

export default function Theme(props: { children: React.ReactNode }) {
 const [theme, setTheme] = useState(true)

 // ...

 useEffect(() => {
  SwitchTheme()
 }, [])

 function SwitchTheme() {
  let root = document.getElementById('main')
  const urlParams = new URLSearchParams(window.location.search)
  let theme = urlParams.get('theme')
  if (theme === 'dark') {
   root?.classList.remove('dark')
   localStorage.setItem('theme', 'light')
   const currentUrl = new URL(window.location.href)
   currentUrl.searchParams.set('theme', 'light')
   window.location.href = currentUrl.href
   setTheme(true)
  } else {
   root?.classList.add('dark')
   localStorage.setItem('theme', 'dark')
   const currentUrl = new URL(window.location.href)
   currentUrl.searchParams.set('theme', 'dark')
   window.location.href = currentUrl.href
   setTheme(false)
  }
 }
 return (
  <>
   <Switch
    isSelected={theme}
    startContent={<SunIcon />}
    endContent={<MoonIcon />}
    size="md"
    onChange={() => {
     SwitchTheme()
    }}
    className="fixed bottom-2 right-2 z-10"
   />
   {props.children}
  </>
 )
}
