export default function Page({ params }: { params: { slug: string } }) {
 return (
  <>
   <h1>{params.slug}</h1>
  </>
 )
}
