"use client";
import { Suspense, useEffect, useState } from "react";

function User() {
  const [osCislo, setOsCislo] = useState<string>("F-----");
  useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const searchParamValue = urlParams.get('user');
      setOsCislo(searchParamValue || "");
  }, []);
    return <>{osCislo}</>;
  
}

export { User };
