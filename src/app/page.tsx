'use client'
import { redirect } from "next/navigation";
import { useEffect, useRef } from "react";
import { setStag } from "./actions";

export default function Home() {
  
  useEffect(() => {
    const redirectUrl = 'https://ws.ujep.cz/ws/login?originalURL=http://localhost:3000';
    const searchParams = new URLSearchParams(window.location.search);
    const params = {
      stagUserTicket: searchParams.get('stagUserTicket'),
      stagUserName: searchParams.get('stagUserName'),
      stagUserRole: searchParams.get('stagUserRole'),
      stagUserInfo: searchParams.get('stagUserInfo')
    }
    if (params.stagUserRole != null) {
      setStag(params)
      .then((param) => {
        if(param.stagUserRole == 'ST') {
          window.location.href = '/student'
        }
      })      
    } else if (!window.location.href.includes(redirectUrl)) {
      // Redirect the user to the specified URL
      window.location.href = redirectUrl;
    }
  }, []);

  return (
    <main>
      <div className="container-row">
          <h1> Laborky</h1>
      </div>
    </main>
  );
}