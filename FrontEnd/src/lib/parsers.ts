import { tTermin } from '@/lib/types'

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
  }
  terminy.push(tmp)
 })
 return terminy
}