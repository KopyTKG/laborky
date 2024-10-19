import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getUserInfo } from '@/lib/stag'
import { isAdmin, isStudent } from './lib/functions'

export async function middleware(request: NextRequest) {
 if (!BaseAuth(request)) {
  if (!request.url.endsWith('/login')) {
   request.nextUrl.pathname = '/login'
   return NextResponse.redirect(request.nextUrl)
  }
 }

 const { pathname } = request.nextUrl
 const ticket = request.cookies.get('stagUserTicket')?.value || ''
 if (!ticket) {
  return NextResponse.next()
 }

 // Handle student path matching
 const studentPathMatch = pathname.match(/^\/student\/([^/]+)(\/moje|\/profil)?$/)
 const ucitelPathMatch = pathname.match(/^\/ucitel\/([^/]+)(\/termin\/[^/]+|\/hledat\/[^/]+)?$/)
 const adminPathMatch = pathname.match(/^\/ucitel\/([^/]+)\/(predmety)?$/)

 const info = await getUserInfo(ticket)
 if (!info) {
  request.nextUrl.pathname = '/logout'
  return NextResponse.redirect(request.nextUrl)
 }

 if (!isAdmin(info) && adminPathMatch) {
  request.nextUrl.pathname = '/'
  return NextResponse.redirect(request.nextUrl)
 }

 if (studentPathMatch && studentPathMatch[1] === info.id) {
  return NextResponse.next()
 }

 if (ucitelPathMatch && ucitelPathMatch[1] === info.id) {
  return NextResponse.next()
 }

 if (pathname === '/') {
  if (isStudent(info)) {
   request.nextUrl.pathname = `/student/${info.id}`
  } else {
   request.nextUrl.pathname = `/ucitel/${info.id}`
  }
  return NextResponse.redirect(request.nextUrl)
 }

 const terminPathMatch = pathname.match(/^\/termin\/([^/]+)$/)
 if (terminPathMatch) {
  const terminID = terminPathMatch[1]
  if (!info.role.includes('ST')) {
   request.nextUrl.pathname = `/ucitel/${info.id}/termin/${terminID}`
   return NextResponse.redirect(request.nextUrl)
  }
 }

 return NextResponse.next()
}

export const config = {
 matcher: [
  {
   source: '/((?!login|logout|api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  },
  '/student/:path*',
  '/ucitel/:path+',
 ],
}

function BaseAuth(request: NextRequest) {
 if (
  request.cookies.get('stagUserTicket') &&
  request.cookies.get('stagUserInfo') &&
  request.cookies.get('stagUserTicket')?.value != '' &&
  request.cookies.get('stagUserInfo')?.value != ''
 ) {
  return true
 } else {
  return false
 }
}
