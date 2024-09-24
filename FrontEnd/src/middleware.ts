import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
export async function middleware(request: NextRequest) {
 if (BaseAuth(request) && Validate(request.cookies.get('stagUserInfo')?.value || '')) {
  let userInfo = request.cookies.get('stagUserInfo')?.value || ''
  let decoded = base64ToText(userInfo) || { stagUserInfo: [{}] }
  let user = decoded?.stagUserInfo[0]
  const id = decoded?.stagUserInfo[0].osCislo

  if (request.url.endsWith('/')) {
   if (user.role == 'ST') {
    request.nextUrl.pathname = '/student/' + id
   } else if (user.role == 'VY') {
    request.nextUrl.pathname = '/ucitel'
   }
   return NextResponse.redirect(new URL(request.nextUrl))
  }

  const match = request.url.match(/([A-Za-z])[1-9]+/)
  if (match && request.url.includes('student')) {
   const urlID = [...match][0]
   if (urlID != id) {
    request.nextUrl.pathname = `/student/${id}`
    return NextResponse.redirect(request.nextUrl)
   }
  } else if (request.url.includes('student')) {
   request.nextUrl.pathname = `/student/${id}`
   return NextResponse.redirect(request.nextUrl)
  }

  // TBA // https://laborky.ujep.cz/terminy?t=zel parsing

  // CONTROL FOR USER AUTH
  //   else {
  //    if (!request.url.includes('student') && user.role == 'ST') {
  // return await Kick(request)
  //    } else if (!request.url.includes('ucitel') && user.role == 'VY') {
  // return await Kick(request)
  //    }  //   }
 } else {
  if (!request.url.endsWith('/login')) {
   return await Kick(request)
  }
 }
}

export const config = {
 matcher: ['/', '/student/:path*', '/ucitel'],
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

async function Kick(request: NextRequest) {
 const ticket = request.cookies.get('stagUserTicket')?.value || ''

 if (ticket == '') {
  request.nextUrl.pathname = '/login'
  return NextResponse.redirect(new URL(request.nextUrl))
 }
 const url = `https://ws.ujep.cz/ws/services/rest2/help/invalidateTicket?ticket=${ticket}`
 const response = await fetch(url, {
  method: 'GET',
  headers: {
   Accept: 'text/plain',
  },
 })
 if (response.ok) {
  request.cookies.clear()
  request.nextUrl.pathname = '/login'
  return NextResponse.redirect(new URL(request.nextUrl))
 } else {
  throw new Error('Ticket not valid')
 }
}

export { base64ToText }
