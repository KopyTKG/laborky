export type tTermin = {
 _id: string
 location: string
 start: Date
 end: Date
 predmet: string
 cislo: number
 kapacita: number
 zapsany: string[]
 vypsal: string
}

export type tLink = {
 label: string
 href: string
 icon: string
}

export type tPredmet = {
 nazev: string
 cviceni: Date[]
}
