import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (Auth(request)) {
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
  } else {
    request.nextUrl.pathname = "/login";
    request.cookies.clear();
    return NextResponse.redirect(new URL(request.nextUrl));
  }
}

export const config = {
  matcher: ["/", "/student", "/student/profil", "/student/moje"],
};

function Auth(request: NextRequest) {
  if (
    request.cookies.get("stagUserTicket") &&
    request.cookies.get("stagUserName") &&
    request.cookies.get("stagUserRole") &&
    request.cookies.get("stagUserInfo")
  ) {
    return true;
  } else {
    return false;
  }
}
