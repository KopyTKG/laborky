import { tTermin, tUser } from '@/lib/types'

export function resTotTermin(data: any): tTermin[] {
 const terminy: tTermin[] = []
 data.forEach((item: any) => {
  const predmet = item?.predmet_terminu
  let cv = 0
  if (predmet) cv = predmet?.pocet_cviceni
  let tmp: tTermin = {
   _id: item.id,
   ucebna: item.ucebna,
   start: new Date(item.datum_start).valueOf(),
   konec: new Date(item.datum_konec).valueOf(),
   nazev: item.jmeno,
   cviceni: item.cislo_cviceni,
   kapacita: item.max_kapacita,
   zapsany: item.aktualni_kapacita,
   vypsal: item.vyucujici,
   tema: item.popis,
   nCviceni: cv,
  }
  terminy.push(tmp)
 })
 return terminy
}

export function setupParser(data: [string, string[], string]): tUser {
 return {
  id: data[0],
  role: data[1] as string[],
  hash: data[2],
 }
}
