'use client';
import { useEffect } from "react";
import { Set } from "./actions";
import { redirect } from "next/navigation";

export default function Home() {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (!searchParams.has("osCislo")) {
      // Redirect to "/login" if "osCislo" query parameter is not present
      // window.location.href = "/login";
    } else {
      const params: any = {
        osCislo: searchParams.get("osCislo"),
      };
      console.log(params);
      Set("osCislo", params.osCislo);
    }
    redirect('/');
  }, []);

  return (
    <main>
      <div className="container-row">
        <h1> Laborky</h1>
      </div>
    </main>
  );
}