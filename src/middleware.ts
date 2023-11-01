import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  
  if(request.url.endsWith("/")) {
    if(Auth(request)) {
      const group = (request.cookies.get('stagUserRole'))?.value;
      if(group == 'ST') {
        request.nextUrl.pathname = "/student";
      } else {
        request.nextUrl.pathname = "/ucitel";
      }      
      return NextResponse.redirect(new URL(request.nextUrl));
    } else {
        request.nextUrl.pathname = "/login";
        return NextResponse.redirect(new URL(request.nextUrl));
    }
  }

  if(request.url.endsWith("/login")) {
    if(Auth(request)) {
      request.nextUrl.pathname = "/";
      return NextResponse.redirect(new URL(request.nextUrl));
    }
  }


  if(!Auth(request)) {
    request.nextUrl.pathname = "/";
    return NextResponse.redirect(new URL(request.nextUrl));
  }
}

export const config = {
  matcher: ["/", "/student", "/student/profil", "/student/moje"],
};



function Auth(request: NextRequest) {
  Expired(request);
  if(request.cookies.get('stagUserTicket') &&
     request.cookies.get('stagUserName') &&
     request.cookies.get('stagUserRole') &&
     request.cookies.get('stagUserInfo')) {
      return true
     }
  else {
    return false
  }
}

function Expired(request: NextRequest) {
  console.log(request.cookies.get("stagUserTicket"));
}