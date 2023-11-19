import Pill from './pill.module'

export default function Pills(props: any) {
 let Terminy = (props.data as any[]).sort((a, b) => {
  if (a.cislo < b.cislo) {
   return -1
  }
  if (a.cislo > b.cislo) {
   return 1
  }
  return 0
 })

 return (
  <>
   <div className="w-max grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-3">
    {Terminy.map((termin: { _id: any; zapsany: string[] }) => (
     <Pill
      key={termin._id}
      owned={termin.zapsany.includes('1f3as45fefvae4') ? true : false}
      {...termin}
     />
    ))}
   </div>
  </>
 )
}
