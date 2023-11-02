import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (BaseAuth(request) && UserAuth(request)) {
    if (request.url.endsWith("/")) {
      const group = request.cookies.get("stagUserRole")?.value;
      if (group == "ST") {
        request.nextUrl.pathname = "/student";
      } else {
        request.nextUrl.pathname = "/ucitel";
      }
      return NextResponse.redirect(new URL(request.nextUrl));
    }

    if (request.url.endsWith("/login")) {
      request.nextUrl.pathname = "/";
      return NextResponse.redirect(new URL(request.nextUrl));
    }
  } else if (BaseAuth(request)) {
    if (request.url.endsWith("/")) {
      const apiUrl = `https://ws.ujep.cz/ws/services/rest2/help/getStagUserListForLoginTicketV2?ticket=${
        request.cookies.get("stagUserTicket")?.value
      }`;
      const data = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Connection: "keep-alive",
        },
      });
      if (!data.ok) {
        console.error("Error:", data.status);
      } else {
        console.log(data);
        const parsed = await data.json();
        const redirectUrl = `?osCislo=${
          parsed.stagUserInfo[0].osCislo
        }&stagUserRole=${request.cookies.get("stagUserRole")?.value}`;
        if (request.url !== redirectUrl) {
          request.nextUrl.pathname = "/";
          request.nextUrl.search = redirectUrl;
          return NextResponse.redirect(new URL(request.nextUrl));
        }
      }
    }
  } else {
    if (!request.url.endsWith("/login")) {
      request.nextUrl.pathname = "/login";
      request.cookies.clear();
      return NextResponse.redirect(new URL(request.nextUrl));
    }
  }
}

export const config = {
  matcher: ["/", "/student", "/student/profil", "/student/moje"],
};
function BaseAuth(request: NextRequest) {
  if (
    request.cookies.get("stagUserTicket") &&
    request.cookies.get("stagUserName") &&
    request.cookies.get("stagUserRole") &&
    request.cookies.get("stagUserInfo") &&
    request.cookies.get("stagUserTicket")?.value != "" &&
    request.cookies.get("stagUserName")?.value != "" &&
    request.cookies.get("stagUserRole")?.value != "" &&
    request.cookies.get("stagUserInfo")?.value != "" 
  
  ) {
    return true;
  } else {
    return false;
  }
}
function UserAuth(request: NextRequest) {
  if (
    request.cookies.has("osCislo") &&
    request.cookies.get("osCislo")?.value != ""
  ) {
    return true;
  } else {
    return false;
  }
}
