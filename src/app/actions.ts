'use server' 
import { cookies } from 'next/headers'
 
export async function setStag(params: any) {
    try{
        if(!cookies().has('stagUserTicket')) {
            cookies().set('stagUserTicket', params.stagUserTicket)
        }
        if(!cookies().has('stagUserName')) {
            cookies().set('stagUserName',  params.stagUserName)
        }
        if(!cookies().has('stagUserRole')) {
            cookies().set('stagUserRole',  params.stagUserRole)
        }
        if(!cookies().has('stagUserInfo')) {
            cookies().set('stagUserInfo',  params.stagUserInfo)
        }

        return params;

    } catch (e) {
        throw e;
    }
}


export async function getParam(param: string) {
    try {
        if(cookies().has(param)) {
            return cookies().get(param)
        } else {
            console.log(`${param} not found`)
        }
    } catch (e) {
        throw e;
    }
}