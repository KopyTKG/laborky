import { Card, CardBody, Link, Tooltip } from '@nextui-org/react'

export default function Predmet({ name }: { name: string }) {
 let color: string = ''
 switch (name) {
  case 'PCA':
   color = 'bg-red-400'
   break
  case 'ZPS':
   color = 'bg-blue-400'
   break
 }

 return (
  <>
   <Tooltip content="Zobrazit terminy pro tento předmet" showArrow={true} delay={500}>
    <Link href={`/ucitel/predmety/${name}`} className="w-max h-max">
     <Card className={`${color} border-2`}>
      <CardBody className="flex flex-col justify-center items-center text-4xl font-bold py-5 px-10 ">
       {name}
      </CardBody>
     </Card>
    </Link>
   </Tooltip>
  </>
 )
}
