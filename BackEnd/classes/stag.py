import requests

def Get(ticket, url, params):
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive", 
        "Accept-Origin": "https://ws.ujep.cz",
    }
    response = requests.get(url, params=params, headers=headers, cookies={'WSCOOKIE': ticket})
    if not response.ok: 
        raise Exception(response.text)
    return response.json()


def GetStagUser(Ticket):
    url = "https://ws.ujep.cz/ws/services/rest2/help/getStagUserListForLoginTicketV2?ticket=" + Ticket 
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive", 
        "Accept-Origin": "https://ws.ujep.cz",
    }
    response = requests.get(url, headers=headers)
    if not response.ok:
        raise Exception(response.text)

    return response.json()