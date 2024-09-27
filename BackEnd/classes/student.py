import requests

def get_predmet_by_student(ticket, semestr):
    """ Vrátí všechny zapsané předměty studentem v daném semestru (ZS / LS)"""
    url = "https://stag-demo.zcu.cz/ws/services/rest2/predmety/getPredmetyByStudent"
    params = {
        "osCislo": "F22153",
        "semestr": semestr,
    }
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive", 
        "Accept-Origin": "https://stag-demo.zcu.cz",
    }
    response = requests.get(url,headers=headers, params=params, cookies={'WSCOOKIE': ticket})
    if not response.ok:
        raise Exception(response.text)
    return response.json()


def get_predmet_student_k_dispozici(ticket, predmety_lab):
    """
    Vrati vsechny predmety, pro ktere existuje moznost seminare, ktere student jeste nema splneny, ale zapsany
    """
    url = "https://stag-demo.zcu.cz/ws/services/rest2/student/getStudentPredmetyAbsolvoval"
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive", 
        "Accept-Origin": "https://stag-demo.zcu.cz",
    }
    response = requests.get(url,headers=headers, cookies={'WSCOOKIE': ticket})
    if not response.ok:
        raise Exception(response.text)
    splneno = []
    aktivni_predmety = []
    predmety = response.json()
    for predmet in predmety["predmetAbsolvoval"]:
        if predmet["zkratka"] in predmety_lab:
            aktivni_predmety.append(predmet["zkratka"]) if predmet["absolvoval"] == "N" else splneno.append(predmet["zkratka"])
    predmety = [item for item in aktivni_predmety if item not in splneno]
    return predmety