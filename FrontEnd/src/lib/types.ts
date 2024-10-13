import React from 'react'

export type tTermin = {
 _id: string
 ucebna: string
 start: number
 konec: number
 nazev: string
 tema: string
 cviceni: number
 kapacita: number
 zapsany?: number
 vypsal?: string[]
 owned?: boolean
 nCviceni?: number
}

export type tSelected = {
 s: string | undefined
}

export type tNode = tTermin & {
 owned: boolean
 typ: string
}

export type tCreate = tTermin & {
 upzornit: boolean
 vyucuje?: string
}

export type tLink = {
 label: string
 href: string
 icon: React.ReactNode
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

export type tStudent = {
 osCislo: string
 jmeno: string
 prijmeni: string
 email: string
 datum_splneni: string | undefined
}

export type tForm = {
 _id: string
 cviceni: string
 nazev: string
 tema: string
 ucebna: string
 kapacita: number
 startDatum: Date
 startCas: string
 konecDatum: Date
 konecCas: string
 upozornit: boolean
}
