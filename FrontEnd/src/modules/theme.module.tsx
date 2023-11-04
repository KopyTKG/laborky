"use client";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { Switch } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function Theme(props: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") === "dark" ? false : true);

 

  // ...

  useEffect(() => {
    SwitchTheme();
  }, [theme]);
  function SwitchTheme() {
    let root = document.getElementById("main");

    if (localStorage.getItem("theme") === "dark") {
      root?.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      root?.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }
  return (
    <>
      <Switch
        defaultSelected={theme}
        startContent={<SunIcon />}
        endContent={<MoonIcon />}
        size="md"
        onChange={() => {
          SwitchTheme();
        }}
        className="fixed bottom-2 right-2 z-10"
      />
      {props.children}
    </>
  );
}
