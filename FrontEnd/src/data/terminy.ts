import { randomInt, randomUUID } from "crypto";


const Terminy: Array<Object> = [];

for (let i = 0; i < 40; i++) {
  const obj = {
    _id: randomUUID(),
    location: 'CP1.01',
    start: new Date("2023-12-01T08:30:00.000Z"), // Update with your desired start time
    end: new Date("2023-12-01T10:00:00.000Z"), // Update with your desired end time
    predmet: 'ZPS',
    cislo: Math.floor(Math.random() * 3) + 1, // Random number between 1 and 3
    kapacita: 10,
    zapsany: [] as string[],
  };

  for (let j = 0; j < randomInt(1, 21); j++) {
    obj.zapsany.push(randomUUID());
  }

  Terminy.push(obj);
}

const Moje: Array<Object> = [

    {
        _id: randomUUID(),
        location: 'CP1.01',
        start: new Date(), // Update with your desired start time
        end: new Date(), // Update with your desired end time
        predmet: 'PCA',
        cislo: 1,
        kapacita: 10,
        zapsany: ['1f3as45fefvae4'],
      }
];

for (let i = 0; i < 3; i++) {
    const obj = {
      _id: randomUUID(),
      location: 'CP1.01',
      start: new Date("2023-12-01T08:30:00.000Z"), // Update with your desired start time
      end: new Date("2023-12-01T10:00:00.000Z"), // Update with your desired end time
      predmet: 'ZPS',
      cislo: i+1,
      kapacita: 10,
      zapsany: ['1f3as45fefvae4'] as string[],
    };
  
    for (let j = 0; j < randomInt(1, 21); j++) {
      obj.zapsany.push(randomUUID());
    }
  
    Moje.push(obj);
  }



export {
    Terminy,
    Moje
}