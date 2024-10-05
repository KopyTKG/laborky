import uvicorn
from fastapi import FastAPI
from classes.stag import *
from classes.vyucujici import *
from classes.student import *
from classes.server_utils import *
from lib.conn import *
from lib.db_utils import *
from lib.db_terminy import *
from lib.HTTP_messages import *
from jose import jwt
from datetime import datetime
from typing import Optional
import re
import dotenv, os, requests, json, hashlib
import time

dotenv.load_dotenv()

app = FastAPI(debug=True)


@app.get("/setup")
async def kontrola_s_databazi(ticket: str | None = None):
    """ Kontrola přihlášeného uživatele s databází po loginu do systému """
    #ticket = os.getenv("TICKET")
    info = kontrola_ticketu(ticket, vyucujici=False)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), info[1]
    if role != "ST":
        message = vytvor_vyucujici(session, userid)
        if message == internal_server_error:
            return internal_server_error
    else:
        message = vytvor_student(session, userid)
        if message == internal_server_error:
            return internal_server_error
    return role


### Student API
## /STUDENT HOME
@app.get("/student") #/student/{osobni_cislo}
async def get_student_home(ticket: str | None = None):
    """ Vrácení všech vypsaných laborek podle toho, na co se student může zapsat """
    info = kontrola_ticketu(ticket, vyucujici=False)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), info[1]

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
    info = kontrola_ticketu(ticket, vyucujici=False)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), info[1]

    if typ == "zapsat":
        message = zapsat_se_na_termin(session, userid, id_terminu) 
        return message
    elif typ == "odhlasit":
        message = odepsat_z_terminu(session, userid, id_terminu)
        return message
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
    info = kontrola_ticketu(ticket, vyucujici=False)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), info[1]

    historie = historie_studenta(session, userid)
    if historie == not_found:
        return not_found
    elif historie == internal_server_error:
        return internal_server_error

    splnene = uspesne_dokoncene_terminy(session, userid)
    if splnene == internal_server_error:
        return internal_server_error
    if splnene == not_found:
        return not_found

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
    info = kontrola_ticketu(ticket, vyucujici=False)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), info[1]

    predmety_k_dispozici = get_predmet_student_k_dispozici(ticket, get_vsechny_predmety(session))

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

@app.get("/predmety")
async def get_predmety(ticket: str | None = None):
    """ Vrátí všechny predmety"""
    #ticket = os.getenv("TICKET")

    # nyní logika:
        # studentovi vrací předměty, pouze které studuje
        # učitelovi vrací předměty, kterých je cvičící
        # škvorovi vrací všechno - neimplementováno

    info = kontrola_ticketu(ticket, vyucujici=False)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), info[1]

    vsechny_predmety = get_vsechny_predmety(session)

    if userid == "VY49712":
        jmena_vsech_predmetu = get_jmena_predmetu_by_kody(session, vsechny_predmety)
        return jmena_vsech_predmetu

    elif role == "ST":
        predmety_k_dispozici = get_predmet_student_k_dispozici(ticket, vsechny_predmety)


    return get_vsechny_predmety(session)



@app.get("/admin/nadchazejici")
async def get_admin_board_next_ones(ticket: str | None = None):
    """Vrátí všechny cvičení v času dopředu dle readme"""
    #ticket = os.getenv("TICKET")
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), info[1]

    list_terminy_dopredu = terminy_dopredu(session)

    vyucujici_list = read_file()
    list_terminu = pridat_vyucujici_k_terminu(list_terminy_dopredu, vyucujici_list)
    return list_terminu

#Všechny týdny
@app.get("/admin")
async def get_admin_board(ticket: str | None = None):
    """ Vrátí všechny vypsané cvičení """
    #ticket = os.getenv("TICKET")
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), info[1]

    list_terminu = list_terminy(session)
    vyucujici_list = read_file()
    list_terminu = pridat_vyucujici_k_terminu(list_terminu, vyucujici_list)

    return list_terminu

@app.get("/ucitel")
async def get_ucitel_board_future_ones(ticket: str | None = None):
    """Vrátí cvičení jednoho učitele v času dopředu dle readme"""
    #ticket = os.getenv("TICKET")
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), info[1]

    list_terminy_dopredu = terminy_dopredu_pro_vyucujiciho(session, userid)
    vyucujici_list = read_file()
    list_terminu = pridat_vyucujici_k_terminu(list_terminy_dopredu, vyucujici_list)
    return list_terminu

@app.get("/ucitel/moje")
async def get_ucitel_moje_vypsane(ticket: str | None = None):
    """ Vrátí všechny cvičení, které vypsal uživatel """
    #ticket = os.getenv("TICKET")
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), info[1]
    
    list_terminu = list_terminy_vyucujici(session, userid)
    vyucujici_list = read_file()
    list_terminu = pridat_vyucujici_k_terminu(list_terminu, vyucujici_list)
    return list_terminu


@app.get("/ucitel/board_by_predmet")
async def get_terminy_by_predmet(ticket: str , predmety: Optional[str] = None):
    """ Vrátí všechny vypsané termíny pro daný předmět """
    #ticket = os.getenv("TICKET")
    info = kontrola_ticketu(ticket, vyucujici=False)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), info[1]
    
    if predmety is None:
        pomocny_list = await get_predmety(ticket)
        predmety = ";".join(pomocny_list)
    list_predmetu = predmety.split(";")
    list_terminu = []
    vyucujici_list = read_file()
    for predmet in list_predmetu:
        predmet = get_kod_predmetu_by_zkratka(session, predmet)
        list_terminu.extend(list_probehle_terminy_predmet(session, predmet))
        list_terminu.extend(list_planovane_terminy_predmet(session, predmet))
    list_terminu = pridat_vyucujici_k_terminu(list_terminu, vyucujici_list)
    return list_terminu


@app.post("/ucitel/termin")
async def ucitel_vytvor_termin(ticket: str, ucebna:str, datum_start: datetime, datum_konec:datetime, max_kapacita:int, zkratka_predmetu: str, jmeno: str, cislo_cviceni: int,popis:str, vyucuje_id: Optional[str] = None):
    """ Učitel vytvoří termín do databáze """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    vypsal_id, role = encode_id(info[0]), info[1]

    kod_predmetu = get_kod_predmetu_by_zkratka(session, zkratka_predmetu)
    if kod_predmetu is None:
        return not_found

    vyucuje_id = get_vyucujiciho_by_predmet(session, kod_predmetu)
    message = vypsat_termin(session, ucebna, datum_start, datum_konec, max_kapacita, vypsal_id, vyucuje_id, kod_predmetu, jmeno, cislo_cviceni, popis)
    return message


@app.patch("/ucitel/termin")
async def ucitel_zmena_terminu(
    ticket: str,
    id_terminu: str,
    ucebna: Optional[str] = None,
    datum_start: Optional[datetime] = None,
    datum_konec: Optional[datetime] = None,
    max_kapacita: Optional[int] = None,
    jmeno: Optional[str] = None,
    cislo_cviceni: Optional[int] = None,
    popis: Optional[str] = None
    ):
    """ Učitel změní parametry v již vypsaném termínu """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    message = upravit_termin(session, id_terminu, newStartDatum=datum_start,newKonecDatum=datum_konec, newUcebna=ucebna, newMax_kapacita=max_kapacita, newJmeno=jmeno, cislo_cviceni=cislo_cviceni,newPopis=popis)
    return message


@app.delete("/ucitel/termin")
async def ucitel_smazani_terminu(ticket: str, id_terminu: str):
    """ Učitel smáže vypsaný termín """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    if smazat_termin(session, id_terminu) == not_found:
        return not_found
    if smazat_termin(session, id_terminu) == ok:
        return ok
    return internal_server_error


## /UCITEL STUDENTI
@app.get("/ucitel/studenti")
async def get_vypis_studentu(ticket: str, id_terminu: str):
    """ Vrácení všech studentů, kteří se zapsali na daný seminář"""
    #ticket = os.getenv('TICKET') # prozatimni reseni
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), info[1]

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
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    id_stud = encode_id(id_stud)
    message = pridat_studenta(session, id_stud, id_terminu)
    return message


@app.post("/ucitel/splneno")
async def post_ucitel_splnit_studentovi(ticket: str, id_stud: str, id_terminu: str, zvolene_datum_splneni: Optional[datetime] = None): #ticket: str | None = None, id_stud: str | None = None, date: date
    """ Zapsat studentovi, že má splněný určitý termín cvičení """
    # ticket = os.getenv("TICKET")
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    id_stud = encode_id(id_stud)
    message = uznat_termin(session, id_terminu, id_stud, zvolene_datum_splneni)
    return message


@app.post("/ucitel/uznat")
async def post_ucitel_uznat_studentovi(ticket: str, id_stud: str, zkratka_predmetu: str):
    """ Uznat studentovi všechna cvičení dle zkratky předmětu """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    id_stud = encode_id(id_stud)
    id_terminu = get_uznavaci_termin_by_zkratka(session, zkratka_predmetu)
    if id_terminu is None:
        return not_found
    message = uznat_termin(session, id_terminu, id_stud)
    return message


@app.get("/ucitel/emaily") # prijima: katedra, zkratka_predmetu, id_terminu
async def get_ucitel_emaily(ticket: str, id_terminu: str): #ticket: str | None = None
    """ Vrátí json s emailama studentů přihlášených na daném termínu
    ve formátu: {osobniCislo: {jemno: , prijmeni:, email: }}"""
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    
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
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    vsichni_studenti = get_studenti_na_predmetu(ticket, zkratka_katedry, zkratka_predmetu)
    vypis_uspesnych = vypis_uspesnych_studentu(session, zkratka_predmetu)

    uspesni_studenti = list(vypis_uspesnych.keys())

    dekodovane = compare_encoded(uspesni_studenti, vsichni_studenti)
    info = get_studenti_info(ticket, dekodovane)

    return info

@app.post("/ucitel/pridat_predmet")
async def post_pridat_predmet(ticket: str, zkratka_predmetu: str, katedra: str, pocet_cviceni: int, vyucuje_id: Optional[str] = None):
    """Vytvoří předmět - admin akce
    Args:
        ticket,
        zkratka predmetu,
        zkratka katedry,
        pocet_cviceni,
        vyucuje_id : id vyučujícího začínající "VY"... když se nechá prázný, bude bráno ID admina,
    """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    id_vypsal, role = encode_id(info[0]), info[1]

    kod_predmetu = katedra + zkratka_predmetu
    if vyucuje_id is None:
        vyucuje_id = id_vypsal
    else:
        vyucuje_id = encode_id(vyucuje_id)

    message = vytvor_predmet(session, kod_predmetu,zkratka_predmetu,katedra,vyucuje_id, pocet_cviceni)

    if message == ok:
        vyucujici_k_predmetum_to_txt(session)
        session.commit()
        datum_start = datetime.now()
        datum_konec = datetime.now() + timedelta(hours=2)
        message = vypsat_termin(session, "Nespecifikovano", datum_start, datum_konec, 1, id_vypsal, vyucuje_id, kod_predmetu, "Uznání předmětu", -1, "Cvičení pro uznání všech cvičení v rámci předmětu")

        return message
    
    else:
        return message

@app.get("/invalidate")
def invalidate(ticket: str):
    url = "https://stag-demo.zcu.cz/ws/services/rest2/help/invalidateTicket?ticket=" + ticket

    response = requests.get(url)
    print(response)
    return 200


@app.get("/")
def root():
    vsechny_predmety = get_vsechny_predmety(session)
    jmena_predmetu = get_jmena_predmetu_by_kody(session, vsechny_predmety)
    return jmena_predmetu


if __name__ == "__main__":
    dotenv.load_dotenv()

    if session:
        print("Session successfully created!")
    else:
        raise Exception("Session creation failed!")
    #vyucujici_k_predmetum_to_txt(session)

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
