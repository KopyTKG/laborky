import { tTermin, tUser } from '@/lib/types'
import { TimeInputValue } from '@nextui-org/react'

export function resTotTermin(data: any): tTermin[] {
 const terminy: tTermin[] = []
 data.forEach((item: any) => {
  let tmp: tTermin = {
   _id: item.id,
   location: item.ucebna,
   start: item.datum_start,
   end: item.datum_konec,
   predmet: item.kod_predmet,
   cislo: item.cislo_cviceni,
   kapacita: item.max_kapacita,
   zapsany: item.aktualni_kapacita,
   vypsal: item.vyucujici,
   poznamka: item.popis,
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
