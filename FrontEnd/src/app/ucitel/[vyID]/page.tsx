import VypsaneTerminy from '@/components/user/vypsaneTerminy'

export default function UcitelPage() {
 return (
  <div className="w-full flex flex-col gap-5 items-center h-full">
   <div className="text-4xl font-bold underline pb-5 mt-5"> Vypsané termíny</div>
   <VypsaneTerminy />
  </div>
 )
}
