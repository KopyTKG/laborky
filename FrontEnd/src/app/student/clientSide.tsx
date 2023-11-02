"use client";
import { useEffect, useState } from "react";
import { Get, deleteParam } from "../actions";
import { Button } from "@nextui-org/react";

function User() {
  const [osCislo, setOsCislo] = useState<any>();
  useEffect(() => {
    if (!osCislo) {
      Get("osCislo").then((osCislo) => {
        setOsCislo(osCislo?.value);
      });
    }
  }, [osCislo]);

  if (!osCislo) {
      return <>F-----</>;
  } else {
      return <>{osCislo}</>;
  }
}

function Logout() {
  function logout() {
    deleteParam("stagUserTicket").then(() => {
      window.location.href = "/";
    });
  }
  return (
    <Button color="danger" onClick={logout}>
      Odhlásit se
    </Button>
  );
}

export { User, Logout };
