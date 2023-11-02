import { Categorie } from "@/data/categorie";
import Category from "@/modules/category.module";
import { User } from "../clientSide";

export default function ProfilePage() {
    return (
        <main>
            <div className="profile">
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