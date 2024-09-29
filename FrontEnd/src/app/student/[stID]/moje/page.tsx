import ZapsaneTerminy from '@/components/user/zapsaneTerminy'

export default function MojeTerminyPage() {
 return (
  <div className="w-full flex flex-col gap-5 items-center h-full">
   <div className="text-4xl font-bold underline pb-5 mt-5"> Moje termíny</div>
   <ZapsaneTerminy />
  </div>
 )
}
