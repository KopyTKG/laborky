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

export type tPredmet = {
 nazev: string
 cviceni: number[]
}

export type tPredmetInfo = {
 _id: string
 zkratka: string
 nazev: string
 nCviceni: number
 vyucujici: string
}
