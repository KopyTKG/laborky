import Filtr from '@/components/filtr'
import FiltrTerminy from '@/components/user/FiltrTerminy'

export default function Page() {
 return (
  <div className="w-full flex flex-row">
   <Filtr/>
   <div>
    <FiltrTerminy />
   </div>
  </div>
 )
}
