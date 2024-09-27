import requests

def Get(ticket, url, params):
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


def GetStagUser(Ticket):
    url = "https://stag-demo.zcu.cz/ws/services/rest2/help/getStagUserListForLoginTicketV2?ticket=" + Ticket 
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





def GetPredmetyByStudent(Ticket):
    url = "https://stag-demo.zcu.cz/ws/services/rest2/predmety/getPredmetyByStudent"
    params = {
        "osCislo": "F22153",
        "semestr": "ZS"
    }
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive", 
        "Accept-Origin": "https://stag-demo.zcu.cz",
    }
    response = requests.get(url,headers=headers, params=params, cookies={'WSCOOKIE': Ticket})
    if not response.ok:
        raise Exception(response.text)
    return response.json()


def GetStudentPredmetyAbsolvoval(Ticket, function):
    url = "https://stag-demo.zcu.cz/ws/services/rest2/student/getStudentPredmetyAbsolvoval"
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive", 
        "Accept-Origin": "https://stag-demo.zcu.cz",
    }
    response = requests.get(url,headers=headers, cookies={'WSCOOKIE': Ticket})
    if not response.ok:
        raise Exception(response.text)
    splneno = []
    aktivni_predmety = []
    predmety = response.json()
    for predmet in predmety["predmetAbsolvoval"]:
        if predmet["zkratka"] in function:
            aktivni_predmety.append(predmet["zkratka"]) if predmet["absolvoval"] == "N" else splneno.append(predmet["zkratka"])
    predmety = [item for item in aktivni_predmety if item not in splneno]
    return aktivni_predmety, splneno, predmety


def GetUcitelPredmety(Ticket):
    """
     Vrati predmety, ktery ucitel vyucuje 
    """
    url = "https://stag-demo.zcu.cz/ws/services/rest2/predmety/getPredmetyByUcitel"
    params = {
        "ucitIdno": "49517",
    }
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive", 
        "Accept-Origin": "https://stag-demo.zcu.cz",
    }
    response = requests.get(url,headers=headers, params=params, cookies={'WSCOOKIE': Ticket})
    if not response.ok:
        raise Exception(response.text)
    return response.json()