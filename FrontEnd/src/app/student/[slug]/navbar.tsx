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

export default function NavbarComponent({ id }: { id: string }) {
 return (
  <Navbar className="w-full flex" isBordered isBlurred>
   <NavbarContent>
    <NavbarItem>
     <Button
      as={Link}
      href={`/student/${id}`}
      color="primary"
      endContent={<Icon name="house" className="w-5" />}
      variant="solid"
     >
      Domů
     </Button>
    </NavbarItem>
    <NavbarItem>
     <Button
      as={Link}
      href={`/student/${id}/moje`}
      color="primary"
      endContent={<Icon name="menu" className="w-5" />}
      variant="solid"
     >
      Moje termíny
     </Button>
    </NavbarItem>
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
