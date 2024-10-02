export default function Page({ params }: { params: { slug: string } }) {
 return (
  <div className="container mx-auto flex flex-col items-center">
   <h1 className="text-3xl font-bold">{params.slug}</h1>
  </div>
 )
}
