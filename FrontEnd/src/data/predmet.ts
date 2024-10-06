import { tPredmet } from '@/lib/types'

function getRandomLetter(): string {
 const alphabet = 'abcdefghijklmnopqrstuvwxyz'
 return alphabet[Math.floor(Math.random() * alphabet.length)]
}

function getRandomString(minLength: number, maxLength: number): string {
 const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength
 let result = ''
 for (let i = 0; i < length; i++) {
  result += getRandomLetter()
 }
 return result
}

function generateRandomText(): string {
 const part1 = getRandomString(2, 3) // Generates a string with 2-3 letters
 const part2 = getRandomString(3, 5) // Generates a string with 3-5 letters
 return `${part1}/${part2}`.toUpperCase()
}

export function randomPredmety(len: number = 30) {
 if (len <= 0) {
  throw new Error('lenght is 0 or lowwer')
 }
 const data: tPredmet[] = [
  {
   _id: crypto.randomUUID(),
   nazev: 'VOLNA/AKTIVITA',
   nCviceni: 0,
  } as tPredmet,
 ]
 for (let index = 0; index < len; index++) {
  const element: tPredmet = {
   _id: crypto.randomUUID(),
   nazev: generateRandomText(),
   nCviceni: 4,
  }
  data.push(element)
 }
 return data
}
