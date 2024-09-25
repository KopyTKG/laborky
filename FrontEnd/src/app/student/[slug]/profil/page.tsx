import { headers as h } from 'next/headers'
import Terminy from '@/modules/terminy'
export default function ProfilePage() {
 const headers = h()
 const url = headers.get('referer')
 const user = url?.split('/').reverse()[1]
 return (
  <>
   <div className="flex flex-col max-w-3xl w-full mx-auto">
    <div className="text-4xl font-bold underline py-5">{user}</div>
    <Terminy />
   </div>
  </>
 )
}
