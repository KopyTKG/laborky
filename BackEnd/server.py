import uvicorn
from fastapi import FastAPI
from classes.stag import *
from classes.vyucujici import *
from classes.student import *
from lib.conn import *
from lib.db_utils import *
from lib.db_terminy import *
from lib.HTTP_messages import *
from jose import jwt
from datetime import datetime
from typing import Optional
import dotenv, os, requests, json, hashlib

dotenv.load_dotenv()

app = FastAPI(debug=True)


@app.get("/setup")
async def kontrola_s_databazi(ticket: str | None = None):
    """ Kontrola přihlášeného uživatele s databází po loginu do systému """
    #ticket = os.getenv("TICKET")
    if ticket is None or ticket == "":
        return unauthorized
    userinfo = get_stag_user_info(ticket)
    if userinfo is None:
        return unauthorized
    userid, role = get_userid_and_role(userinfo)
    if role != "ST":
        userid = encode_id(userid)
        vytvor_vyucujici(session, userid)
    else:
        userid = encode_id(userid)
        vytvor_student(session, userid)
    return role


### Student API
## /STUDENT HOME
@app.get("/student") #/student/{osobni_cislo}
async def get_student_home(ticket: str | None = None):
    """ Vrácení všech vypsaných laborek podle toho, na co se student může zapsat """
    #ticket = os.getenv('TICKET') # prozatimni reseni
    userinfo = kontrola_ticketu(ticket)
    if userinfo is None:
        return unauthorized

    userid, role = get_userid_and_role(userinfo)
    userid = encode_id(userid)

    if role != "ST":
        return unauthorized

    predmety_k_dispozici = get_predmet_student_k_dispozici(ticket, get_vsechny_predmety(session))

    vyhodnoceni = vyhodnoceni_studenta(session, userid, pocet_cviceni_pro_predmet(session))

    list_terminu = list_dostupnych_terminu(session, predmety_k_dispozici, vyhodnoceni, userid)
        # vrací seznam laborek, které jsou studentovi k dispozici
            # předmět nemá uznaný a studuje ho
    
    vyucujici_list = read_file()
    list_terminu = pridat_vyucujici_k_terminu(list_terminu, vyucujici_list)

    return list_terminu


@app.post("/student")
async def zmena_statusu_zapsani(ticket: str, typ: str, id_terminu: str):
    """ Zaregistruje, či se odhlásí z labu, na základě ukázky na hlavní straně
    Args:
        ticket (str): Uživatelský autentizační token.
        typ (str): Typ operace, buď 'zapsat' pro zapsání nebo 'odhlasit' pro odhlášení.
        id_terminu (str): Identifikační kód termínu, na který se má akce vztahovat.

    Returns:
        HTTP code(str): 200 - OK, 401 - Unauthorized, 400 - Bad Request, 409 - Conflict"""

    #ticket = os.dotenv("TICKET")
    userinfo = kontrola_ticketu(ticket)
    if userinfo is None:
        return unauthorized
    userid, role = get_userid_and_role(userinfo)
    userid = encode_id(userid)
    if typ == "zapsat":
        if zapsat_se_na_termin(session, userid, id_terminu):
            return ok
        else:
            return conflict
    elif typ == "odhlasit":
        message = odepsat_z_terminu(session, userid, id_terminu)
        if message == 0:
            return ok
        elif message == 1: # uzivatel se chtel odepsat z termínu, který má splněný
            return unauthorized
        elif message == 2: # uzivatel se chtel odepsat mene nez 24 hodin pred zacatkem cviceni
            return conflict
        elif message == 3: # uzivatel se chtel přihlásit na termín který neexistuje
            return bad_request
    else:
        return bad_request


## /STUDENT MOJE
@app.get("/student/moje")
async def get_student_moje(ticket: str | None = None):
    """ Vrátí cvičení, na kterých je student aktuálně zapsán
    Args:
        ticket (str): Uživatelský autentizační token.

    Returns:
        list_terminu (list): Seznam cvičení, na kterých je student aktuálně zapsán a nemá je splněné
        """
    #ticket = os.getenv('TICKET')
    userinfo = kontrola_ticketu(ticket)
    if userinfo is None:
        return unauthorized
    userid, role = get_userid_and_role(userinfo)
    if role != "ST":
        return unauthorized
    userid = encode_id(userid)

    historie = historie_studenta(session, userid)
    splnene = uspesne_dokoncene_terminy(session, userid)

    list_terminu = subtract_lists(historie, splnene)
    
    vyucujici_list = read_file()
    list_terminu = pridat_vyucujici_k_terminu(list_terminu, vyucujici_list)

    return list_terminu


## PROFIL
@app.get("/profil")
async def get_student_profil(ticket: str | None = None):
    """ Vraci zaznam o vsech typech cviceni na vsechny predmety, ktere ma student
    zapsane na portalu STAG a jsou zaroven v Databazi, zda je student splnil ci nikoli"""
    #ticket = os.getenv("TICKET") # prozatimni reseni
    userinfo = kontrola_ticketu(ticket)
    if userinfo is None:
        return unauthorized
    userid, role = get_userid_and_role(userinfo)
    predmety_k_dispozici = get_predmet_student_k_dispozici(ticket, get_vsechny_predmety(session))


    userid = encode_id(userid)

    if role != "ST":
        return unauthorized

    pocet_pro_predmet = pocet_cviceni_pro_predmet(session)
    vyhodnoceni_vsech_predmetu = vyhodnoceni_studenta(session, userid, pocet_pro_predmet)

    vyhodnoceni = {}

    for predmet in predmety_k_dispozici:
        if predmet in list(vyhodnoceni_vsech_predmetu.keys()):
            vyhodnoceni[predmet] = vyhodnoceni_vsech_predmetu[predmet]

    # format: {"KodPred": [0, 1, 1]} # len list = pocet cviceni, index = index cviceni, 0 nesplnil 1 splnil
    return vyhodnoceni


### Ucitel API
#Cvičení příští týden
# TOHLE DODĚLAT
@app.get("/admin/nadchazejici")
async def get_admin_board_next_ones(ticket: str | None = None):
    """Vrátí všechny cvičení v času dopředu dle readme"""
    #ticket = os.getenv("TICKET")
    userinfo = kontrola_ticketu(ticket)
    if userinfo is None:
        return unauthorized
    userid, role = get_userid_and_role(userinfo)
    if role == "ST":
        return unauthorized
    list_terminy_dopredu = terminy_dopredu(session)

    vyucujici_list = read_file()
    list_terminu = pridat_vyucujici_k_terminu(list_terminy_dopredu, vyucujici_list)
    return list_terminu

#Všechny týdny
@app.get("/admin")
async def get_admin_board(ticket: str | None = None):
    """ Vrátí všechny vypsané cvičení """
    #ticket = os.getenv("TICKET")
    userinfo = kontrola_ticketu(ticket)
    if userinfo is None:
        return unauthorized
    userid, role = get_userid_and_role(userinfo)
    if role == "ST":
        return unauthorized

    list_terminu = list_terminy(session)
    vyucujici_list = read_file()
    list_terminu = pridat_vyucujici_k_terminu(list_terminu, vyucujici_list)

    return list_terminu

@app.get("/ucitel")
async def get_ucitel_board_future_ones(ticket: str | None = None):
    """Vrátí cvičení jednoho učitele v času dopředu dle readme"""
    #ticket = os.getenv("TICKET")
    userinfo = kontrola_ticketu(ticket)
    if userinfo is None:
        return unauthorized
    userid, role = get_userid_and_role(userinfo)
    userid = encode_id(userid)
    if role == "ST":
        return unauthorized
    list_terminy_dopredu = terminy_dopredu_pro_vyucujiciho(session, userid)
    vyucujici_list = read_file()
    list_terminu = pridat_vyucujici_k_terminu(list_terminy_dopredu, vyucujici_list)
    return list_terminu

@app.get("/ucitel/moje")
async def get_ucitel_moje_vypsane(ticket: str | None = None):
    """ Vrátí všechny cvičení, které vypsal uživatel """
    #ticket = os.getenv("TICKET")
    userinfo = kontrola_ticketu(ticket)
    if userinfo is None:
        return unauthorized
    userid, role = get_userid_and_role(userinfo)
    userid = encode_id(userid)
    list_terminu = list_terminy_vyucujici(session, userid)
    vyucujici_list = read_file()
    list_terminu = pridat_vyucujici_k_terminu(list_terminu, vyucujici_list)
    return list_terminu


@app.get("/ucitel/board_by_predmet")
async def get_terminy_by_predmet(ticket: str , predmet: str):
    """ Vrátí všechny vypsané termíny pro daný předmět """
    #ticket = os.getenv("TICKET")
    userinfo = kontrola_ticketu(ticket)
    if userinfo is None:
        return unauthorized

    predmet = get_kod_predmetu_by_zkratka(session, predmet)
    if predmet is None:
        return not_found

    terminy_dle_predmetu_old = list_probehle_terminy_predmet(session, predmet)
    terminy_dle_predmetu_new = list_planovane_terminy_predmet(session, predmet)
    terminy_dle_predmetu = terminy_dle_predmetu_new + terminy_dle_predmetu_old
    vyucujici_list = read_file()
    list_terminu = pridat_vyucujici_k_terminu(terminy_dle_predmetu, vyucujici_list)
    return list_terminu


@app.post("/ucitel/termin")
async def ucitel_vytvor_termin(ticket: str, ucebna:str, datum_start: datetime, datum_konec:datetime, max_kapacita:int, kod_predmet: str, jmeno: str, cislo_cviceni: int, vyucuje_id: Optional[str] = None):
    """ Učitel vytvoří termín do databáze """
    userinfo = kontrola_ticketu(ticket)
    if userinfo is None:
        return unauthorized
    
    userid, role = get_userid_and_role(userinfo)
    if role == "ST":
        return unauthorized
    
    vypsal_id = encode_id(userid)

    kod_predmetu = get_kod_predmetu_by_zkratka(session, kod_predmet)
    if kod_predmetu is None:
        return not_found

    vyucuje_id = get_vyucujiciho_by_predmet(session, kod_predmetu)
    
    if vypsat_termin(session, ucebna, datum_start, datum_konec, max_kapacita, vypsal_id, vyucuje_id, kod_predmet, jmeno, cislo_cviceni):
        return ok
    else:
        return internal_server_error


@app.patch("/ucitel/termin")
async def ucitel_zmena_terminu(
    ticket: str,
    id_terminu: str,
    ucebna: Optional[str] = None,
    datum_start: Optional[datetime] = None,
    datum_konec: Optional[datetime] = None,
    max_kapacita: Optional[int] = None,
    jmeno: Optional[str] = None,
    cislo_cviceni: Optional[int] = None
    ):
    """ Učitel změní parametry v již vypsaném termínu """
    userinfo = kontrola_ticketu(ticket)
    if userinfo is None:
        return unauthorized
    if upravit_termin(session, id_terminu, newStartDatum=datum_start,newKonecDatum=datum_konec, newUcebna=ucebna, newMax_kapacita=max_kapacita, newJmeno=jmeno, cislo_cviceni=cislo_cviceni):
        return ok
    return internal_server_error


@app.delete("/ucitel/termin")
async def ucitel_smazani_terminu(ticket: str, id_terminu: str):
    """ Učitel smáže vypsaný termín """
    userinfo = kontrola_ticketu(ticket)
    if userinfo is None:
        return unauthorized
    userid, role = get_userid_and_role(userinfo)
    if role == "ST":
        return unauthorized
    if smazat_termin(session, id_terminu):
        return ok
    return internal_server_error


## /UCITEL STUDENTI
@app.get("/ucitel/studenti")
async def get_vypis_studentu(ticket: str, id_terminu: str):
    """ Vrácení všech studentů, kteří se zapsali na daný seminář"""
    #ticket = os.getenv('TICKET') # prozatimni reseni
    userinfo = kontrola_ticketu(ticket)
    if userinfo is None:
        return unauthorized
    userid, role = get_userid_and_role(userinfo)
    if role == "ST":
        return unauthorized

    vsechny_terminy = get_vsechny_terminy(session)
    if id_terminu not in vsechny_terminy:
        return bad_request

    list_studentu = list_studenti_z_terminu(session, id_terminu)
    zkratka_predmetu, zkratka_katedry = get_katedra_predmet_by_idterminu(session, id_terminu)
    vsichni_studenti = get_studenti_na_predmetu(ticket, zkratka_katedry, zkratka_predmetu)
    dekodovane_cisla = compare_encoded(list_studentu, vsichni_studenti)
    jmena_studentu = get_studenti_info(ticket,  dekodovane_cisla)

    return jmena_studentu
        # vraci {osCislo: {jmeno: , prijmeni: , email: }}


@app.post("/ucitel/zapis")
async def post_ucitel_zapsat_studenta(ticket: str, id_stud: str, id_terminu: str): #ticket: str | None = None, id_stud: str | None = None
    """ Ručně přihlásí studenta do vypsaného termínu cvičení """
    # ticket = os.getenv("TICKET")
    if ticket is None or ticket == "":
        return unauthorized
    id_stud = encode_id(id_stud)
    status_message = pridat_studenta(session, id_stud, id_terminu)
    if status_message == 0:
        return ok
    elif status_message == 1 :
        return not_found
    else:
        return conflict


@app.post("/ucitel/splneno")
async def post_ucitel_splnit_studentovi(ticket: str, id_stud: str, id_terminu: str, zvolene_datum_splneni: Optional[datetime] = None): #ticket: str | None = None, id_stud: str | None = None, date: date
    """ Zapsat studentovi, že má splněný určitý termín cvičení """
    # ticket = os.getenv("TICKET")
    if ticket is None or ticket == "":
        return unauthorized
    id_stud = encode_id(id_stud)
    if uznat_termin(session, id_terminu, id_stud, zvolene_datum_splneni):
        return ok
    else:
        return not_found


@app.get("/ucitel/emaily") # prijima: katedra, zkratka_predmetu, id_terminu
async def get_ucitel_emaily(ticket: str, id_terminu: str): #ticket: str | None = None
    """ Vrátí json s emailama studentů přihlášených na daném termínu
    ve formátu: {osobniCislo: {jemno: , prijmeni:, email: }}"""
    #ticket = os.getenv("TICKET")
    if ticket is None or ticket == "":
        return unauthorized
    list_studentu = list_studenti_z_terminu(session, id_terminu)
    zkratka_predmetu, zkratka_katedry = get_katedra_predmet_by_idterminu(session, id_terminu)
    vsichni_studenti = get_studenti_na_predmetu(ticket, zkratka_katedry, zkratka_predmetu)
    dekodovane_cisla = compare_encoded(list_studentu, vsichni_studenti)
    emaily_studentu = get_studenti_info(ticket,  dekodovane_cisla)

    return emaily_studentu
        # vraci: {osobniCislo: {jemno: , prijmeni:, email: }}


@app.get("/ucitel/uspesni_studenti")
async def get_uspesni_studenti_by_predmet(ticket: str, zkratka_predmetu: str, zkratka_katedry: str):
    """ Vrátí seznam studentů, kteří mají všechny cvičení splněné z daného předmětu"""
    #ticket = os.getenv("TICKET")
    if ticket is None or ticket == "":
        return unauthorized

    vsichni_studenti = get_studenti_na_predmetu(ticket, zkratka_katedry, zkratka_predmetu)
    vypis_uspesnych = vypis_uspesnych_studentu(session, zkratka_predmetu)

    uspesni_studenti = list(vypis_uspesnych.keys())

    dekodovane = compare_encoded(uspesni_studenti, vsichni_studenti)
    info = get_studenti_info(ticket, dekodovane)

    return info

@app.post("/ucitel/pridat_predmet")
async def post_pridat_predmet(ticket: str, zkratka_predmetu: str, katedra: str,vyucuje_id: str, pocet_cviceni: int):
    """Vytvoří předmět - testing only"""
    if ticket is None or ticket == "":
        return unauthorized
    kod_predmetu = katedra + zkratka_predmetu
    vyucuje_id = encode_id(vyucuje_id)
    if vytvor_predmet(session, kod_predmetu,zkratka_predmetu,katedra,vyucuje_id, pocet_cviceni):
        vyucujici_k_predmetum_to_txt(session)
        return ok
    else:
        return 409


def encode_id(id):
    """ Sha1 pro hashování osobních čísel / ucitIdnu """
    return hashlib.sha1(id.encode()).hexdigest()


def kontrola_ticketu(ticket):
    if ticket is None or ticket == "":
        return None

    userinfo = get_stag_user_info(ticket)

    if userinfo is None:
        return None
    return userinfo


def vyucujici_k_predmetum_to_txt(session):
    temp_file = ".temp_vyucujici.txt"

    predmety_kod_katedra = get_vsechny_predmety_kod_katedra(session)
    vyucujici = {}
    for predmet in predmety_kod_katedra:
        vyucujici_predmetu = get_vyucujici_predmetu_stag(predmet[0], predmet[1])
        if vyucujici_predmetu is None:
            vyucujici_seznam = []
        
        elif isinstance(vyucujici_predmetu, str):
            vyucujici_seznam = [name.strip() for name in vyucujici_predmetu.split(',')] if vyucujici_predmetu.strip() else []
        else:
            vyucujici_seznam = []

        # Combine department and course code to form a unique key
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


if __name__ == "__main__":
    dotenv.load_dotenv()

    if session:
        print("Session successfully created!")
    else:
        raise Exception("Session creation failed!")
    vyucujici_k_predmetum_to_txt(session)

    uvicorn.run(app, host=os.getenv('HOST'), port=int(os.getenv('PORT')))





"""
url = "https://stag-demo.zcu.cz/ws/services/rest2/rozvrhy/getRozvrhByMistnost"
params = {
    'budova':'CP',
    'mistnost':'6.13',
    'semestr': 'ZS',
    'katedra': 'KI',
}
ticket = 'a7fdf5c7e56ebdc48356eb0a3701ad5fa5524f8920d36f4c11ca4681aec209f4'
response = Get(url=url,params=params,ticket=ticket)
print(response)
with open("dump.json", "w") as outfile:
(response, outfile)
"""
