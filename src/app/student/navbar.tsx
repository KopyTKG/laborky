import {
  Navbar,
  NavbarItem,
  NavbarContent,
  NavbarBrand,
  Link,
  Button,
} from "@nextui-org/react";

export default function NavbarComponent() {
  return (
    <Navbar className="w-full flex bg-gray-800">
      <NavbarContent>
        <NavbarItem>
          <Button
            as={Link}
            href="/student"
            color="primary"
            showAnchorIcon
            variant="solid"
          >
            Domů
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            href="/student/moje"
            color="primary"
            showAnchorIcon
            variant="solid"
          >
            Moje termíny
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarBrand className="flex w-full justify-end">
        <NavbarItem>
          <Link href="/student/profil"> F ---- </Link>
        </NavbarItem>
      </NavbarBrand>
    </Navbar>
  );
}

/*

<nav className="w-full">
            <div className='buttons'>
                <a href="/student">Domů</a>
                <a href="/student/moje">Moje termíny</a>
            </div>
            <div className="title">Laborky UJEP</div>
            <a className="user" href="/student/profil">
                <div className="icon"></div>
                F -----
            </a>
        </nav>

*/
