import { Categorie } from "@/data/categorie";
import Category from "@/modules/category.module";

export default function ProfilePage() {
    return (
        <main>
            <div className="profile">
               <div className="user">
                   F -----
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