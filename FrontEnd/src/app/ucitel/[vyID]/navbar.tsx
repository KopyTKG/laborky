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

const baseUrl = '/ucitel'
const Links: tLink[] = [
 {
  label: 'Domů',
  href: `${baseUrl}`,
  icon: 'house',
 },
 {
  label: 'Moje předměty',
  href: `${baseUrl}/predmety`,
  icon: 'menu',
 },
 {
  label: 'Studenti',
  href: `${baseUrl}/studenti`,
  icon: 'users',
 },
]

export default function NavbarComponent({id}: {id: string}) {
 return (
  <Navbar className="w-full flex" isBordered isBlurred>
   <NavbarContent>
    {Links.map((link) => (
     <NavbarItem key={link.label}>
      <Button
       as={Link}
       href={link.href}
       color="primary"
       endContent={<Icon name={link.icon as any} className="w-5" />}
       variant="solid"
      >
       {link.label}
      </Button>
     </NavbarItem>
    ))}
   </NavbarContent>
   <NavbarBrand className="flex w-full justify-end gap-5">
    <NavbarItem>
     <Button as={Link} href="/logout" className="flex gap-2" color="danger">
      Odhlásit se
      <Icon name="log-out" />
     </Button>
    </NavbarItem>
    <NavbarItem>
     <Link href="/ucitel/profil" className="flex gap-2">
      <Avatar size="sm" color="default" />
      {id}
     </Link>
    </NavbarItem>
   </NavbarBrand>
  </Navbar>
 )
}
