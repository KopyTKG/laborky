'use server'
import { cookies } from 'next/headers'

export async function setStag(params: any) {
 const oneDay = Date.now() + 60 * 60 * 1000 * 1.15
 cookies().set('stagUserTicket', params.stagUserTicket, { expires: oneDay })
 cookies().set('stagUserInfo', params.stagUserInfo, { expires: oneDay })
 return params
}

export async function Set(key: string, value: string) {
 const oneDay = Date.now() + 60 * 60 * 1000 * 1.15

 await cookies().set(key, value, { expires: oneDay })
 return value
}

export async function getParam(param: string) {
 if (cookies().has(param)) {
  return cookies().get(param)
 } else {
  return null
 }
}

export async function deleteParam(param: string) {
 if (cookies().has(param)) {
  return cookies().delete(param)
 } else {
  return null
 }
}

export async function Get(key: string) {
 return cookies().get(key)
}
