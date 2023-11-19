import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
export async function middleware(request: NextRequest) {
 if (BaseAuth(request) && Validate(request.cookies.get('stagUserInfo')?.value || '')) {
  let userInfo = request.cookies.get('stagUserInfo')?.value || ''
  let decoded = base64ToText(userInfo) || { stagUserInfo: [{}] }
  let user = decoded?.stagUserInfo[0]
  if (request.url.endsWith('/')) {
   if (user.role == 'ST') {
    request.nextUrl.pathname = '/student'
   } else if (user.role == 'VY') {
    request.nextUrl.pathname = '/ucitel'
   }
   return NextResponse.redirect(new URL(request.nextUrl))
  } else {
   if (!request.url.includes('student') && user.role == 'ST') {
    return Kick(request)
   } else if (!request.url.includes('ucitel') && user.role == 'VY') {
    return Kick(request)
   }
  }
 } else {
  if (!request.url.endsWith('/login')) {
   return Kick(request)
  }
 }
}

export const config = {
 matcher: ['/', '/student', '/student/profil', '/student/moje', '/ucitel'],
}
function BaseAuth(request: NextRequest) {
 if (
  request.cookies.get('stagUserTicket') &&
  request.cookies.get('stagUserName') &&
  request.cookies.get('stagUserRole') &&
  request.cookies.get('stagUserInfo') &&
  request.cookies.get('stagUserTicket')?.value != '' &&
  request.cookies.get('stagUserName')?.value != '' &&
  request.cookies.get('stagUserRole')?.value != '' &&
  request.cookies.get('stagUserInfo')?.value != ''
 ) {
  return true
 } else {
  return false
 }
}

function Validate(base: string) {
 if (base == '') {
  return false
 }
 try {
  base64ToText(base)
  return true
 } catch (e) {
  return false
 }
}

function base64ToText(base64: string) {
 const binaryString = atob(base64)
 const Bytes = new Uint8Array(Array.from(binaryString, (m) => m.charCodeAt(0)))
 return JSON.parse(new TextDecoder().decode(Bytes))
}

function Kick(request: NextRequest) {
 request.nextUrl.pathname = '/login'
 request.cookies.clear()
 return NextResponse.redirect(new URL(request.nextUrl))
}

export { base64ToText }
