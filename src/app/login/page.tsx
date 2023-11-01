"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { Set, setStag } from "../actions";

export default function Home() {
  //const {stag, setStag} = useAuth();
  useEffect(() => {
    const redirectUrl = `https://ws.ujep.cz/ws/login?originalURL=${process.env.NEXT_PUBLIC_BASE}/login`;
    const searchParams = new URLSearchParams(window.location.search);
    const params = {
      stagUserTicket: searchParams.get("stagUserTicket"),
      stagUserName: searchParams.get("stagUserName"),
      stagUserRole: searchParams.get("stagUserRole"),
      stagUserInfo: searchParams.get("stagUserInfo"),
    };
    setStag(params);

    
    if (params.stagUserRole != null) {
      const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const apiUrl = `https://ws.ujep.cz/ws/services/rest2/help/getStagUserListForLoginTicketV2?ticket=${searchParams.get("stagUserTicket")}`;
      fetch(
        `${corsProxyUrl}${apiUrl}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Connection: "keep-alive",
          },
        }
      ).then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          //Set("osCislo", data.stagUserInfo[0].osCislo);
          console.log(data);
        } else {
          console.error("Error:", res.status);
        }
      });
    } else if (!window.location.href.includes(redirectUrl)) {
      // Redirect the user to the specified URL
      window.location.href = redirectUrl;
    }
  }, []);

  return (
    <main>
      <div className="container-row">
        <h1>Login</h1>
      </div>
    </main>
  );
}
