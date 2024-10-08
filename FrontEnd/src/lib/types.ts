import { TimeInputValue } from '@nextui-org/react'
import React from 'react'

export type tTermin = {
 _id: string
 location: string
 start: Date
 end: Date
 predmet: string
 poznamka?: string
 cislo: number
 kapacita: number
 zapsany: number
 vypsal: string[]
 owned?: boolean
}

export type tSelected = {
 s: string | undefined
}

export type tNode = tTermin & {
 owned: boolean
 typ: string
 setReload: React.Dispatch<React.SetStateAction<boolean>>
}

export type tLink = {
 label: string
 href: string
 icon: string
}

export type tPredmetSekce = {
 nazev: string
 cviceni: number[]
}

export type tPredmet = {
 _id: string
 nazev: string
 nCviceni: number
}

export type tUser = {
 id: string
 role: string
 hash: string
}

export type tTerminBody = {
 predmet: {
  _id: string
  nazev: string
  nCviceni: number
 }
 cviceni: number
 nazev: string
 tema: string
 ucebna: string
 kapacita: number
 datum: string
 start: TimeInputValue
 end: TimeInputValue
}
