import { User as UserData } from "@/data/categorie";
import Laborator from "@/modules/laborator.module";
import { randomUUID } from "crypto";
export default function Terminy() {
    return (
        <>
         <div className="cats">
                    {UserData.Laborky.map((cat) => (
                        <Laborator key={randomUUID()} state={cat} />
                        ))}
               </div>
        </>
    )
}