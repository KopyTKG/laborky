import { Categorie } from "@/data/categorie";
import Category from "@/modules/category.module";
import { User } from "../clientSide";

export default function ProfilePage() {
    return (
        <main className="h-screen grid flex-col">
            <div className="profile flex self-start">
               <div className="user">
                   <User/>
               </div>
               <div className="cats">
                    {Categorie.map((cat) => (
                        <Category key={cat.title} {...cat} />
                    ))}
               </div>
            </div>
        </main>
    )
}