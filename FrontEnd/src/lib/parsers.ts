import { tTermin, tTerminBody, tUser } from '@/lib/types'
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

export function tBodyTOtTermin(data: tTerminBody): tTermin {
 return {
  _id: data.predmet._id,
  ucebna: data.ucebna,
  start: `${data.datum}T${formatTime(data.start)}.000Z`,
  konec: `${data.datum}T${formatTime(data.end)}.000Z`,
  nazev: data.nazev,
  tema: data.tema,
  cviceni: data.cviceni,
  kapacita: data.kapacita,
 }
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
