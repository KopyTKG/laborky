import Filtr from '@/components/filtr'
import FiltrTerminy from '@/components/user/FiltrTerminy'

export default function Page() {
 return (
  <div className="w-full grid grid-cols-5 gap-2">
   <Filtr/>
   <div className="col-span-4 col-start-2">
    <FiltrTerminy />
   </div>
  </div>
 )
}
