import { tTermin, tUser } from '@/lib/types'
import { TimeInputValue } from '@nextui-org/react'

export function resTotTermin(data: any): tTermin[] {
 const terminy: tTermin[] = []
 data.forEach((item: any) => {
  let tmp: tTermin = {
   _id: item.id,
   ucebna: item.ucebna,
   start: item.datum_start,
   konec: item.datum_konec,
   nazev: item.kod_predmet,
   cviceni: item.cislo_cviceni,
   kapacita: item.max_kapacita,
   zapsany: item.aktualni_kapacita,
   vypsal: item.vyucujici,
   tema: item.popis,
  }
  terminy.push(tmp)
 })
 return terminy
}

export function setupParser(data: string[]): tUser {
 return {
  id: data[0],
  role: data[1],
  hash: data[2],
 }
}

export function formatTime(timeObj: TimeInputValue) {
 const { hour, minute, second } = timeObj
 return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
}

export function DateTime(date: Date, time: string): number {
 const regex = /[0-2][0-9]:[0-6][0-9]:[0-6][0-9]/i
 return new Date(date.toJSON().replace(regex, time + ':00')).valueOf()
}

export function Time(timestamp: number): string {
 const datetime = new Date(timestamp)
 return `${datetime.getHours().toString().padStart(2, '0')}:${datetime.getMinutes().toString().padStart(2, '0')}`
}
