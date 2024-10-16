import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { fastHeaders } from '@/lib/stag'
import { setupParser } from './lib/parsers'

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

 const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/setup`)
 url.searchParams.set('ticket', ticket)
 const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
 if (!res.ok) {
  return NextResponse.next()
 }

 const data = await res.json()
 const info = setupParser(data)

 // Handle student path matching
 const studentPathMatch = pathname.match(/^\/student\/([^/]+)(\/moje|\/profil)?$/)
 const ucitelPathMatch = pathname.match(
  /^\/ucitel\/([^/]+)(\/predmety|\/termin\/[^/]+|\/studenti|\/student\/[^/]+)?$/,
 )

 if (studentPathMatch && studentPathMatch[1] === info.id) {
  return NextResponse.next() // Already on the correct student page
 }

 if (ucitelPathMatch && ucitelPathMatch[1] === info.id) {
  return NextResponse.next() // Already on the correct teacher page
 }
 // Handle redirect to the correct role path
 if (pathname === '/') {
  if (info.role === 'ST') {
   request.nextUrl.pathname = `/student/${info.id}`
  } else if (info.role) {
   request.nextUrl.pathname = `/ucitel/${info.id}`
  }
  return NextResponse.redirect(request.nextUrl)
 }

 const terminPathMatch = pathname.match(/^\/termin\/([^/]+)$/)
 if (terminPathMatch) {
  const terminID = terminPathMatch[1]
  if (info.role != 'ST') {
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
