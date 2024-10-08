import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { fastHeaders } from '@/lib/stag'
import { setupParser } from './lib/parsers'

export async function middleware(request: NextRequest) {
 if (BaseAuth(request) && Validate(request.cookies.get('stagUserInfo')?.value || '')) {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/setup`)
  const ticket = request.cookies.get('stagUserTicket')?.value || ''
  if (!ticket) {
   return
  }

  url.searchParams.set('ticket', ticket)
  const res = await fetch(url.toString(), { method: 'GET', headers: fastHeaders })
  if (!res.ok) {
   return
  }
  const data = await res.json()
  const info = setupParser(data)

  if (request.url.endsWith('/')) {
   if (info.role == 'ST') {
    request.nextUrl.pathname = '/student/' + info.id
   } else {
    request.nextUrl.pathname = '/ucitel/' + info.id
   }
   return NextResponse.redirect(new URL(request.nextUrl))
  }

  if (request.url.includes('student') || request.url.includes('ucitel')) {
   const STmatch = request.url.match(/([A-Za-z])[1-9]\w+/)
   if (STmatch && request.url.includes('student')) {
    const urlID = [...STmatch][0]
    if (urlID != info.id) {
     request.nextUrl.pathname = `/student/${info.id}`
     return NextResponse.redirect(request.nextUrl)
    }
   }

   const VYmatch = request.url.match(/(vy)[1-9]\w+/)
   if (VYmatch && request.url.includes('ucitel')) {
    const urlID = [...VYmatch][0]
    if (urlID != info.id) {
     request.nextUrl.pathname = `/ucitel/${info.id}`
     return NextResponse.redirect(request.nextUrl)
    }
   }
  } else {
   request.nextUrl.pathname = '/'
   return NextResponse.redirect(request.nextUrl)
  }
 } else {
  if (!request.url.endsWith('/login')) {
   request.nextUrl.pathname = '/login'
   return NextResponse.redirect(request.nextUrl)
  }
 }
}

export const config = {
 matcher: [
  {
   source: '/((?!login|logout|api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)', // Match all routes except /login
  },
  '/student/:path*', // Continue matching all routes under /student
  '/ucitel/:path+', // Continue matching all routes under /ucitel
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

export { base64ToText }
