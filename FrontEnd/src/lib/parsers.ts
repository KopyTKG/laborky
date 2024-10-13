import { tTermin, tUser } from '@/lib/types'

export function resTotTermin(data: any): tTermin[] {
 const terminy: tTermin[] = []
 data.forEach((item: any) => {
  const predmet = item?.predmet_termin
  let cv = 0
  if (predmet) cv = predmet.pocet_cviceni
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
   nCviceni: cv,
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
