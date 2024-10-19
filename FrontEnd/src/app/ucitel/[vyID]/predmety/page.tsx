import AdminToolbar from '@/components/adminToolbar'
import Predmety from '@/components/predmety'
import { Header } from '@/components/ui/header'

export default function Page() {
 return (
  <div className="w-max mx-auto flex flex-col items-center gap-2">
   <Header underline="fade" className="w-max">
    Předměty
   </Header>
   <AdminToolbar />
   <Predmety />
  </div>
 )
}
