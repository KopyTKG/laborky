import { Terminy } from "@/data/terminy"
import Pill from "@/modules/pill.module"

export default function StudentPage() {
    let one = 0;

    return (
        <main>
            <div className="container">
               <h1> Vypsane termíny</h1>
               <div className="pills">
                    {Terminy.map((termin) => (
                        <Pill key={termin.id} {...termin} enabled={ 
                            termin.type == 1? (
                            one++? true : false): true }/>
                        ))}
                </div>
            </div>
        </main>
    )
}