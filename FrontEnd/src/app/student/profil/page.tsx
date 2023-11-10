import { User } from "../clientSide";
import Terminy from "@/modules/terminy";
export default function ProfilePage() {
    return (
        <>
         <div className="container mx-auto">
               <div className="text-4xl font-bold underline my-5">
                   <User/>
               </div>
               <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 items-center gap-10">
               <Terminy/>
               </div>
            </div>
        </>
    )
}