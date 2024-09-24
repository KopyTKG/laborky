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
import Icon from '@/components/icon'

export default function NavbarComponent() {
 return (
  <Navbar className="w-full flex" isBordered isBlurred>
   <NavbarContent>
    <NavbarItem>
     <Button
      as={Link}
      href="/student"
      color="primary"
      endContent={<Icon name="house" className="w-5" />}
      variant="solid">
      Domů
     </Button>
    </NavbarItem>
    <NavbarItem>
     <Button
      as={Link}
      href="/student/moje"
      color="primary"
      endContent={<Icon name="menu" className="w-5" />}
      variant="solid">
      Moje termíny
     </Button>
    </NavbarItem>
   </NavbarContent>
   <NavbarBrand className="flex w-full justify-end gap-5">
    <NavbarItem>
     <Logout />
    </NavbarItem>
    <NavbarItem>
     <Link href="/student/profil" className="flex gap-2">
      <Avatar size="sm" color="default" />
      <User />
     </Link>
    </NavbarItem>
   </NavbarBrand>
  </Navbar>
 )
}
