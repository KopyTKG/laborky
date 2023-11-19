import { User } from '../clientSide'
import Terminy from '@/modules/terminy'
export default function ProfilePage() {
 return (
  <>
   <div className="flex flex-col w-[40rem] mx-auto">
    <div className="text-4xl font-bold underline py-5">
     <User />
    </div>
    <Terminy />
   </div>
  </>
 )
}
