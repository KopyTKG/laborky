import {
 Navbar,
 NavbarItem,
 NavbarContent,
 NavbarBrand,
 Link,
 Button,
 Avatar,
} from '@nextui-org/react'
import Icon from '@/components/icon'
import { tLink } from '@/lib/types'
import { House, Menu, Users } from 'lucide-react'

export function NavbarStudent({ id }: { id: string }) {
 const baseUrl = '/student/#id'
 const url = baseUrl.replace('#id', id)
 const links: tLink[] = [
  {
   label: 'Domů',
   href: `${url}`,
   icon: <House className="w-5" />,
  },
  {
   label: 'Moje termíny',
   href: `${url}/moje`,
   icon: <Menu className="w-5" />,
  },
 ]
 return <NavbarComponent id={id} links={links} url={url} st={false} />
}

export function NavbarTeacher({ id }: { id: string }) {
 const baseUrl = '/ucitel/#id'
 const url = baseUrl.replace('#id', id)
 const links: tLink[] = [
  {
   label: 'Domů',
   href: `${url}`,
   icon: <House className="w-5" />,
  },
  {
   label: 'Procházet',
   href: `${url}/predmety`,
   icon: <Menu className="w-5" />,
  },
  {
   label: 'Studenti',
   href: `${url}/hledat`,
   icon: <Users className="w-5" />,
  },
 ]

 return <NavbarComponent id={id} links={links} url={url} st={true} />
}

function NavbarComponent({
 id,
 links,
 url,
 st,
}: {
 id: string
 links: tLink[]
 url: string
 st: boolean
}) {
 return (
  <Navbar className="w-full flex" isBordered isBlurred>
   <NavbarContent>
    {links.map((item: tLink) => {
     return (
      <NavbarItem key={item.href}>
       <Button as={Link} href={item.href} color="primary" endContent={item.icon} variant="solid">
        {item.label}
       </Button>
      </NavbarItem>
     )
    })}
   </NavbarContent>
   <NavbarBrand className="flex w-full justify-end gap-5">
    <NavbarItem>
     <Button as={Link} href="/logout" className="flex gap-2" color="danger">
      Odhlásit se
      <Icon name="log-out" />
     </Button>
    </NavbarItem>
    <NavbarItem>
     {st ? (
      <div className="flex gap-2 text-blue-500">
       <Avatar size="sm" color="default" />
       {id}
      </div>
     ) : (
      <Link href={`${url}/profil`} className="flex gap-2">
       <Avatar size="sm" color="default" />
       {id}
      </Link>
     )}
    </NavbarItem>
   </NavbarBrand>
  </Navbar>
 )
}
