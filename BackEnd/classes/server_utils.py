import hashlib
from lib.HTTP_messages import *
from classes.stag import *
from lib.db_utils import *
import os, json
from pydantic import BaseModel
import datetime
from typing import Optional


class tTermin(BaseModel):
    model_config =  {
        "arbitrary_types_allowed": True
    }
    ucebna: str
    datum_start: datetime
    datum_konec: datetime
    max_kapacita: int
    kod_predmetu: str
    jmeno: str
    cislo_cviceni: int
    popis: str
    upozornit: Optional[bool] = None
    vyucuje_prijmeni: Optional[str] = None

def encode_id(id):
    """ Sha1 pro hashování osobních čísel / ucitIdnu """
    return hashlib.sha1(id.encode()).hexdigest()


def kontrola_ticketu(ticket, vyucujici = True):
    if ticket is None or ticket == "":
        return unauthorized

    userinfo = get_stag_user_info(ticket)
    if userinfo is None:
        return unauthorized

    userid, role = get_userid_and_role(userinfo)
    if role == internal_server_error:
        return internal_server_error
    if vyucujici and role == "ST":
        return unauthorized

    return [userid, role]


def read_file():
    temp_file = ".temp_vyucujici.txt"

    with open(temp_file, "r", encoding="utf-8") as infile:
        vyucujici_list = json.load(infile)
    return vyucujici_list


def vyucujici_k_predmetum_to_txt(session):
    temp_file = ".temp_vyucujici.txt"

    predmety_kod_katedra = get_vsechny_predmety_kod_katedra(session)
    vyucujici = {}
    for predmet in predmety_kod_katedra:
        vyucujici_predmetu = get_vyucujici_predmetu_stag(predmet[0], predmet[1])
        if vyucujici_predmetu is None:
            vyucujici_seznam = []
        elif vyucujici_predmetu == "":
            vyucujici_seznam = []
        else:
            vyucujici_seznam = vyucujici_predmetu.split("', '")

            if vyucujici:
                vyucujici_seznam[0] = vyucujici_seznam[0].lstrip("'")
                vyucujici_seznam[-1] = vyucujici_seznam[-1].rstrip("'")

        vyucujici[predmet[1] + "/" + predmet[0]] = vyucujici_seznam if vyucujici_seznam else [""]


    if os.path.exists(temp_file):
        os.remove(temp_file)
    with open(temp_file, "w", encoding="utf-8") as outfile:
        json.dump(vyucujici, outfile, ensure_ascii=False, indent=4)


def get_jmena_predmetu_by_zkratka(session, zkratky_predmetu):
    jmena_predmetu = []
    for zkratka in zkratky_predmetu:
        katedra = get_katedra_by_predmet(session, zkratka)
        if katedra is None:
            jmeno = zkratka
        else:
            jmeno = katedra + "/" + zkratka
        jmena_predmetu.append(jmeno)

    return jmena_predmetu


def get_predmet_id_jmeno_cisla(predmety):
    predmet_id_jmeno_cisla = []
    for predmet in predmety:
        info = {}
        info["id"] = predmet.kod_predmetu
        info["pocet_cviceni"] = predmet.pocet_cviceni
        predmet_id_jmeno_cisla.append(info)

    return predmet_id_jmeno_cisla


def get_predmety_by_kody(session, kody_predmetu):
    predmety = []
    for kod in kody_predmetu:
        predmet = get_predmet_by_id(session, kod)
        if predmet is None:
            continue
        else:
            predmety.append(predmet)

    return predmety