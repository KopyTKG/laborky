"use server";
import { cookies } from "next/headers";

export async function setStag(params: any) {
  const oneDay = Date.now() + 60 * 60 * 1000 * 1.15 ;
  cookies().set("stagUserTicket", params.stagUserTicket, { expires: oneDay });
  cookies().set("stagUserName", params.stagUserName, { expires: oneDay });
  cookies().set("stagUserRole", params.stagUserRole, { expires: oneDay });
  cookies().set("stagUserInfo", params.stagUserInfo, { expires: oneDay });
  return params;
}

export async function Set(key: string, value: string) {
  cookies().set(key, value);
  return value;
}

export async function getParam(param: string) {
  try {
    if (cookies().has(param)) {
      return cookies().get(param);
    } else {
      return null;
    }
  } catch (e) {
    throw e;
  }
}


export async function deleteParam(param: string) {
  try {
    if (cookies().has(param)) {
      return cookies().delete(param);
    } else {
      return null;
    }
  } catch (e) {
    throw e;
  }
}