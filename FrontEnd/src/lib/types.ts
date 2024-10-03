export type tTermin = {
 _id: string
 location: string
 start: Date
 end: Date
 predmet: string
 cislo: number
 kapacita: number
 zapsany: number
 vypsal: string
 owned?: boolean
}

export type tLink = {
 label: string
 href: string
 icon: string
}

export type tPredmet = {
 nazev: string
 cviceni: number[] //Date[] | undefined
}

export type tPredmetInfo = {
 _id: string
 zkratka: string
 nazev: string
 nCviceni: number
 vyucujici: string
}
