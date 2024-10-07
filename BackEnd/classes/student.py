import requests
import os
from classes.stag import *
import json

def get_predmet_by_student(ticket, semestr, userid):
    """ Vrátí všechny zapsané předměty studentem v daném semestru (ZS / LS)"""
    url = "ws/services/rest2/predmety/getPredmetyByStudent"
    params = {
        "osCislo": userid,
        "semestr": semestr,
    }
    return get(ticket, url, params)


def get_predmet_student_k_dispozici(ticket, predmety_lab):
    """
    Vrati vsechny predmety, pro ktere existuje moznost seminare, ktere student jeste nema splneny, ale zapsany
    """
    url = os.getenv('STAG_URL') + "ws/services/rest2/student/getStudentPredmetyAbsolvoval" # type: ignore
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
    zkratky = []
    for predmet in predmety_lab:
        zkratky.append((predmet.kod_predmetu).split("/")[-1])

    for predmet in predmety["predmetAbsolvoval"]:
        if predmet["zkratka"] in zkratky:
            aktivni_predmety.append(predmet["katedra"] + "/" + predmet["zkratka"]) if predmet["absolvoval"] == "N" else splneno.append(predmet["zkratka"])
    predmety = [item for item in aktivni_predmety if item not in splneno]
    return predmety


def pridat_vyucujici_k_terminu(terminy, vyucujici_list):
    """ Prida vyucujici do terminu """
    try: 
        for i, termin in enumerate(terminy):
            termin_dict = vars(termin)
            kod = termin_dict["kod_predmet"]
            vyucujici = vyucujici_list[kod]
            termin_dict["vyucujici"] = vyucujici

            terminy[i] = termin_dict
    except:
        return terminy
    return terminy
