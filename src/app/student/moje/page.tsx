import { Moje } from "@/data/terminy"
import Pill from "@/modules/pill.module"

export default function MojeTerminyPage() {

    return (
        <main>
            <div className="container">
               <h1> Moje termíny</h1>
               <div className="pills">
                    {Moje.map((termin) => (
                        <Pill key={termin.id} {...termin} owned={true} enabled={termin.id == 1?true: false}/>
                        ))}
                </div>
            </div>
        </main>
    )
}