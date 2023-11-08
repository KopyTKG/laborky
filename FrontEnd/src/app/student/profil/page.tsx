import { User } from "../clientSide";
import Terminy from "@/modules/terminy";
export default function ProfilePage() {
    return (
        <>
            <div className="profile flex self-start">
               <div className="user">
                   <User/>
               </div>
               <Terminy/>
            </div>
        </>
    )
}