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

const links: tLink[] = [
 {
  label: 'Domů',
  href: '/student/#id',
  icon: 'house',
 },
 {
  label: 'Moje termíny',
  href: '/student/#id/moje',
  icon: 'menu',
 },
]

export default function NavbarComponent({ id }: { id: string }) {
 return (
  <Navbar className="w-full flex" isBordered isBlurred>
   <NavbarContent>
    {links.map((item: tLink) => {
     return (
      <NavbarItem key={item.href}>
       <Button
        as={Link}
        href={item.href.replace('#id', id)}
        color="primary"
        endContent={<Icon name={item.icon as any} className="w-5" />}
        variant="solid">
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
     <Link href={`/student/${id}/profil`} className="flex gap-2">
      <Avatar size="sm" color="default" />
      {id}
     </Link>
    </NavbarItem>
   </NavbarBrand>
  </Navbar>
 )
}
