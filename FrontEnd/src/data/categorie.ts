import { randomUUID } from 'crypto'

const User = {
 _id: () => {
  return randomUUID()
 },
 osCislo: 'F-----',
 Laborky: [
  {
   nazev: 'PCA',
   cviceni: ['', ''],
  },
  {
   nazev: 'ZPS',
   cviceni: [new Date(), new Date(), ''],
  },
  {
   nazev: 'ZEL',
   cviceni: [new Date(), ''],
  },
 ],
 Terminy: [
  //TerminID
  () => {
   for (let i = 0; i < 5; i++) return randomUUID()
  },
 ],
}

export { User }
