'use client'
import { Checkbox, CheckboxGroup } from '@nextui-org/react'
import { useCallback, useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function Filtr({ predmety }: { predmety: string[] }) {
 const [selected, setSelected] = useState<string[]>(predmety)

 const router = useRouter()
 const pathname = usePathname()
 const searchParams = useSearchParams()

 const Reroute = useCallback(() => {
  const params = new URLSearchParams(searchParams.toString())
  params.set('s', selected.join('-'))

  router.push(pathname + '?' + params.toString())
 }, [selected])

 useEffect(() => {
  Reroute()
 }, [selected])

 return (
  <CheckboxGroup
   label="Předměty"
   color="warning"
   orientation="horizontal"
   value={selected}
   onValueChange={setSelected}
  >
   <Checkbox value="a">A</Checkbox>
   <Checkbox value="b">B</Checkbox>
   <Checkbox value="c">C</Checkbox>
  </CheckboxGroup>
 )
}
