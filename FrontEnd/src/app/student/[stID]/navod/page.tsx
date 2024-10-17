import Predmet from '@/components/tabulkaPredmet'
import { Header } from '@/components/ui/header'
import { tPredmetSekce } from '@/lib/types'

export default function NavodSt() {
 return (
  <section className="flex flex-row">
   <main className="flex flex-col gap-10 w-full">
    <p>
     <Header underline="fade">Úvodní stránka</Header>
    </p>
    <p>
     <Header underline="fade">Zapsané terminy</Header>
    </p>
    <p>
     <Header underline="fade">Profil studenta</Header>
     Stránka profilu obsahuje seznam všech dostupných předmětů a jejich cvičení. Dála zde najít tuto
     tabulku pro každý dostupný předmět,
     <Predmet predmet={{ nazev: 'Předmět', cviceni: ['01-01-1997', 0, 0] } as tPredmetSekce} />
     která značí stav jednotlivých cvičení danného předmětu.
    </p>
   </main>
   <nav className="w-[20rem] bg-red-100/20"></nav>
  </section>
 )
}
