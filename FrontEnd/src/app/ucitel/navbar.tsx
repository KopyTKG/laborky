import {
 Navbar,
 NavbarItem,
 NavbarContent,
 NavbarBrand,
 Link,
 Button,
 Avatar,
} from '@nextui-org/react'
import { Logout, User } from '../clientSide'
import { Bars3Icon, HomeIcon } from '@heroicons/react/24/outline'

const baseUrl = '/ucitel'
const Links = [
 {
  label: 'Domů',
  href: `${baseUrl}`,
  icon: <HomeIcon className="w-5" />,
 },
 {
  label: 'Moje termíny',
  href: `${baseUrl}/moje`,
  icon: <Bars3Icon className="w-5" />,
 },
]

export default function NavbarComponent() {
 return (
  <Navbar className="w-full flex" isBordered isBlurred>
   <NavbarContent>
    {Links.map((link) => (
     <NavbarItem key={link.label}>
      <Button as={Link} href={link.href} color="primary" endContent={link.icon} variant="solid">
       {link.label}
      </Button>
     </NavbarItem>
    ))}
   </NavbarContent>
   <NavbarBrand className="flex w-full justify-end gap-5">
    <NavbarItem>
     <Logout />
    </NavbarItem>
    <NavbarItem>
     <Link href="/ucitel/profil" className="flex gap-2">
      <Avatar size="sm" color="default" />
      <User />
     </Link>
    </NavbarItem>
   </NavbarBrand>
  </Navbar>
 )
}
