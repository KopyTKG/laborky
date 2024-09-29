import requests
from classes.stag import *


def get_predmet_by_student(ticket, semestr, userid):
    """ Vrátí všechny zapsané předměty studentem v daném semestru (ZS / LS)"""
    url = "/ws/services/rest2/predmety/getPredmetyByStudent"
    params = {
        "osCislo": userid,
        "semestr": semestr,
    }
    return get(ticket, url, params)


def get_predmet_student_k_dispozici(ticket, predmety_lab):
    """
    Vrati vsechny predmety, pro ktere existuje moznost seminare, ktere student jeste nema splneny, ale zapsany
    """
    url = "/ws/services/rest2/student/getStudentPredmetyAbsolvoval"
    response = get(ticket, url, params)
    splneno = []
    aktivni_predmety = []
    predmety = response.json()
    for predmet in predmety["predmetAbsolvoval"]:
        if predmet["zkratka"] in predmety_lab:
            aktivni_predmety.append(predmet["zkratka"]) if predmet["absolvoval"] == "N" else splneno.append(predmet["zkratka"])
    predmety = [item for item in aktivni_predmety if item not in splneno]
    return predmety


def get_student_profil(ticket, historie_terminu, osCislo=None):
    """ Vraci zaznam o vsech typech cviceni, zda je ma student splnene ci ne """
    pass

"""
def pocet_cviceni_pro_predmet(session):
    predmety = session.query(distinct(Predmet.zkratka_predmetu)).all()
    predmet_pocet_cviceni = {}

    for predmet in predmety:
        nazev = predmet[0]
        predmet_obj = session.query(Predmet).filter_by(zkratka_predmetu=nazev).first()

        if predmet_obj:
            pocet_cviceni = predmet_obj.pocet_cviceni
            predmet_pocet_cviceni[nazev] = [0] * pocet_cviceni

    return predmet_pocet_cviceni
"""