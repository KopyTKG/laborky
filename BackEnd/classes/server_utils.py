import hashlib
from lib.HTTP_messages import *
from classes.stag import *
from lib.db_utils import *
import os


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

        vyucujici[predmet[1] + predmet[0]] = vyucujici_seznam


    if os.path.exists(temp_file):
        os.remove(temp_file)
    with open(temp_file, "w", encoding="utf-8") as outfile:
        json.dump(vyucujici, outfile, ensure_ascii=False, indent=4)


def read_file():
    temp_file = ".temp_vyucujici.txt"

    with open(temp_file, "r", encoding="utf-8") as infile:
        vyucujici_list = json.load(infile)
    return vyucujici_list


def get_jmena_predmetu_by_kody(session, zkratky_predmetu):
    jmena_predmetu = []
    for zkratka in zkratky_predmetu:
        katedra = get_katedra_by_predmet(session, zkratka)
        if katedra is None:
            jmeno = zkratka
        else:
            jmeno = katedra + "/" + zkratka
        jmena_predmetu.append(jmeno)

    return jmena_predmetu