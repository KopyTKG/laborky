"use client";
import {
  Navbar,
  NavbarItem,
  NavbarContent,
  NavbarBrand,
  Link,
  Button,
  Avatar,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { User } from "./clientSide";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { deleteParam } from "../actions";

export default function NavbarComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function logout() {
    deleteParam("stagUserTicket").then(() => {
      window.location.href = "/";
    });
  }

  return (
    <Navbar
      className="w-full flex"
      isBordered
      isBlurred
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarMenu className="h-full bg-transparent ">
        <NavbarMenuItem>
          <Button
            as={Link}
            className="w-full"
            color="primary"
            href="/student"
            endContent={<HomeIcon className="w-5" />}
          >
            Domů
          </Button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Button
            as={Link}
            href="/student/moje"
            className="w-full"
            color="primary"
            endContent={<Bars3Icon className="w-5" />}
            variant="solid"
          >
            Moje termíny
          </Button>
        </NavbarMenuItem>
        <NavbarMenuItem className="flex h-full pb-[8rem] items-end">
          <Button
            className="w-full"
            color="danger"
            onClick={logout}
            endContent={<ArrowRightOnRectangleIcon className="w-5" />}
          >
            Odhlásit se
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>

      <NavbarContent className="hidden sm:grid md:flex gap-4" justify="center">
        <NavbarItem>
          <Button
            as={Link}
            href="/student"
            color="primary"
            endContent={<HomeIcon className="w-5" />}
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
            endContent={<Bars3Icon className="w-5" />}
            variant="solid"
          >
            Moje termíny
          </Button>
        </NavbarItem>
        <NavbarItem className="flex justify-self-end">
          <Button
            color="danger"
            onClick={logout}
            endContent={<ArrowRightOnRectangleIcon className="w-5" />}
          >
            Odhlásit se
          </Button>
        </NavbarItem>
      </NavbarContent>
      

      <NavbarBrand className="flex w-full justify-end gap-5">
        <NavbarItem>
          <Link href="/student/profil" className="flex gap-2">
            <Avatar size="sm" color="default" />
              <User />
          </Link>
        </NavbarItem>
      </NavbarBrand>
    </Navbar>
  );
}
