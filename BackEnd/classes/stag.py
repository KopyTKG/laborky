import requests

def get(ticket, url, params):
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive", 
        "Accept-Origin": "https://stag-demo.zcu.cz",
    }
    response = requests.get(url, params=params, headers=headers, cookies={'WSCOOKIE': ticket})
    if not response.ok: 
        raise Exception(response.text)
    return response.json()


def get_stag_user_info(ticket):
    url = "https://stag-demo.zcu.cz/ws/services/rest2/help/getStagUserListForLoginTicketV2?ticket=" + ticket 
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive", 
        "Accept-Origin": "https://stag-demo.zcu.cz",
    }
    response = requests.get(url, headers=headers)
    if not response.ok:
        raise Exception(response.text)

    return response.json()


def get_userid_and_role(json):
    role = json["stagUserInfo"][0]["role"]
    if role != "ST":
        userid = "VY" + str(json["stagUserInfo"][0]["ucitIdno"])
    else:
        userid = "F" + str(json["stagUserInfo"][0]["osCislo"])
    return userid, role
