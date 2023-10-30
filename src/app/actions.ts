'use server' 
import { cookies } from 'next/headers'
 
export async function setStag(params: any) {
    const oneDay = 60 * 60;
    cookies().set('stagUserTicket', params.stagUserTicket, {maxAge: oneDay})
    cookies().set('stagUserName',  params.stagUserName, {maxAge: oneDay})
    cookies().set('stagUserRole',  params.stagUserRole, {maxAge: oneDay})
    cookies().set('stagUserInfo',  params.stagUserInfo, {maxAge: oneDay})
    return params;
}


export async function getParam(param: string) {
    try {
        if(cookies().has(param)) {
            return cookies().get(param)
        } else {
            return null
        }
    } catch (e) {
        throw e;
    }
}