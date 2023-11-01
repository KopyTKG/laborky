import { Terminy } from "@/data/terminy"
import Pill from "@/modules/pill.module"
export default function StudentPage() {
    return (
        <main>
            <div className="container">
               <h1> Vypsane termíny</h1>
               <div className="pills">
                    {Terminy.map((termin) => (
                        <Pill key={termin.id} {...termin}/>
                        ))}
                </div>
            </div>
        </main>
    )
}