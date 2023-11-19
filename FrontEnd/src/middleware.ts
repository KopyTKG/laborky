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
    return await Kick(request)
   } else if (!request.url.includes('ucitel') && user.role == 'VY') {
    return await Kick(request)
   }
  }
 } else {
  if (!request.url.endsWith('/login')) {
   return await Kick(request)
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

async function Kick(request: NextRequest) {
 const ticket = request.cookies.get('stagUserTicket')?.value || ''
 const url = `https://ws.ujep.cz/ws/services/rest2/rozvrhy/getRozvrhByStudent?stagUser=${ticket}&osCislo=F22118`
 const response = await fetch(url, {
  method: 'GET',
  headers: {
   Accept: 'application/json',
   'Content-Type': 'application/json',
  },
 })
 console.log(url)
 console.log(response.status)

 //  if (ticket == '') {
 // request.nextUrl.pathname = '/login'
 // return NextResponse.redirect(new URL(request.nextUrl))
 //  }
 //  const url = `https://ws.ujep.cz/ws/services/rest2/help/invalidateTicket?ticket=${ticket}`
 //  const response = await fetch(url, {
 // method: 'GET',
 // headers: {
 //  Accept: 'text/plain',
 // },
 //  })
 //  if (response.ok) {
 // request.cookies.clear()
 // request.nextUrl.pathname = '/login'
 // return NextResponse.redirect(new URL(request.nextUrl))
 //  } else {
 // throw new Error('Ticket not valid')
 //  }
}

export { base64ToText }
