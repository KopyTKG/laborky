import uvicorn
from fastapi import FastAPI # type: ignore
from classes.stag import *
from classes.vyucujici import *
from classes.student import *
from classes.server_utils import *
from lib.conn import *
from lib.db_utils import *
from lib.db_terminy import *
from lib.HTTP_messages import *
from jose import jwt # type: ignore
from datetime import datetime
from typing import Optional
import re
import dotenv, os, requests, json, hashlib
import time
from classes.server_utils import tTermin



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

        if message != ok:
            return message
    else:
        message = vytvor_student(session, userid)
        if message == internal_server_error:
            return internal_server_error
    return info[0], role, userid


@app.get("/setup/ucitel")
async def nastavit_uciteli_jeho_predmety(ticket: str | None = None):
    """ Podle rozvrhu vyučujícího a předmětů z DB, vytvoří relace se všemi předměty, které vyučující vyučuje"""
    try:
        info = kontrola_ticketu(ticket, vyucujici=False)
        if info == unauthorized or info == internal_server_error:
            return info
        userid, role = encode_id(info[0]), info[1]
        predmety_vyucujiciho = get_vyucujici_predmety(ticket, get_vsechny_predmety_obj(session))
        message = pridej_vyucujicimu_predmety_list(session, userid, predmety_vyucujiciho)
        if message != ok:
            return message
    except:
        return internal_server_error
    return ok


### Student API
## /STUDENT HOME
@app.get("/student") #/student/{osobni_cislo}
async def get_student_home(ticket: str | None = None):
    """ Vrácení všech vypsaných laborek podle toho, na co se student může zapsat """
    info = kontrola_ticketu(ticket, vyucujici=False)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), info[1]

    predmety_k_dispozici = get_predmet_student_k_dispozici(ticket, get_vsechny_predmety_obj(session))
    if predmety_k_dispozici == internal_server_error:
        return internal_server_error
    vyhodnoceni = vyhodnoceni_studenta(session, userid, pocet_cviceni_pro_predmet(session))
    if vyhodnoceni == internal_server_error:
        return internal_server_error
    
    list_terminu = list_dostupnych_terminu(session, predmety_k_dispozici, vyhodnoceni, userid)
    if list_terminu == internal_server_error:
        return internal_server_error
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
    info = kontrola_ticketu(ticket, vyucujici=False)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), info[1]


    predmety_k_dispozici = get_predmet_student_k_dispozici(ticket, get_vsechny_predmety_obj(session)) # vrátí předměty, které student studuje podle stagu (formát KAT/PRED)
    if predmety_k_dispozici == internal_server_error:
        return internal_server_error

    pocet_pro_predmet = pocet_cviceni_pro_predmet(session) # vrací dict všech předmětů z DB a počet cvičení, formát: {kat/pred: [0, 0, 0], ...}
    if pocet_pro_predmet == internal_server_error:
        return internal_server_error

    vyhodnoceni_vsech_predmetu = vyhodnoceni_studenta(session, userid, pocet_pro_predmet) # vraci dict vyhodnoceni studenta všech předmětů z db
    if vyhodnoceni_vsech_predmetu == internal_server_error:
        return internal_server_error
    vyhodnoceni = {}

    for predmet in predmety_k_dispozici:
        if predmet in list(vyhodnoceni_vsech_predmetu.keys()):
            vyhodnoceni[predmet] = vyhodnoceni_vsech_predmetu[predmet]

    # format: {"kat/pred": [0, 1, 1], ...} # len list = pocet cviceni, index = index cviceni, 0 nesplnil 1 splnil
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

    # vracet: idpredmetu, jmeno, pocet cviceni

    info = kontrola_ticketu(ticket, vyucujici=False)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), info[1]

    vsechny_predmety = get_vsechny_predmety_obj(session)
    if vsechny_predmety == internal_server_error:
        return internal_server_error

    # dekan#_ujp což je náš ekvivalent Škvora
    if info[0] == "VY49712":
        jmena_vsech_predmetu = get_predmet_id_jmeno_cisla(vsechny_predmety)
        return jmena_vsech_predmetu

    if role == "VY": # možná přidáme ještě nějaké role
        predmety_vyucujiciho = get_predmety_by_vyucujici(session, userid)
        if predmety_vyucujiciho is None:
            return internal_server_error
        if predmety_vyucujiciho == internal_server_error:
            return internal_server_error

        jmena_predmetu_vyucujiciho = get_predmet_id_jmeno_cisla(predmety_vyucujiciho)
        return jmena_predmetu_vyucujiciho

    elif role == "ST":
        predmety_k_dispozici = get_predmet_student_k_dispozici(ticket, vsechny_predmety)
        if predmety_k_dispozici is None:
            return internal_server_error
        if predmety_k_dispozici == internal_server_error:
            return internal_server_error
        predmety = get_predmety_by_kody(session, predmety_k_dispozici)
        if predmety == internal_server_error:
            return internal_server_error
        jmena_predmetu_k_dispozici = get_predmet_id_jmeno_cisla(predmety)
        return jmena_predmetu_k_dispozici

    return None # vrací nic, když uživatel není žádná role



@app.get("/admin/nadchazejici")
async def get_admin_board_next_ones(ticket: str | None = None):
    """Vrátí všechny cvičení v času dopředu dle readme"""
    #ticket = os.getenv("TICKET")
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), info[1]

    list_terminy_dopredu = terminy_dopredu(session)
    if list_terminy_dopredu == internal_server_error:
        return internal_server_error
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
    if list_terminu == internal_server_error:
        return internal_server_error
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
    if list_terminy_dopredu == internal_server_error:
        return internal_server_error
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
    if list_terminu == internal_server_error:
        return internal_server_error
    vyucujici_list = read_file()
    list_terminu = pridat_vyucujici_k_terminu(list_terminu, vyucujici_list)
    return list_terminu


@app.get("/ucitel/termin")
async def get_info_o_terminu(ticket: str, id_terminu: str):
    """ Vrácení všech studentů, a i kteří se zapsali na daný seminář a info o termínu"""
    #ticket = os.getenv('TICKET') # prozatimni reseni
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), info[1]
    vsechny_terminy = get_vsechny_terminy(session)
    if vsechny_terminy == internal_server_error:
        return internal_server_error
    if id_terminu not in vsechny_terminy:
        return not_found

    list_studentu = list_studenti_z_terminu(session, id_terminu)
    if list_studentu == internal_server_error:
        return internal_server_error
    vystup = get_katedra_predmet_by_idterminu(session, id_terminu)
    if vystup == internal_server_error:
        return internal_server_error
    if vystup is None:
        return not_found
    
    studenti = get_list_studentu(ticket, list_studentu, vystup)
    if studenti == internal_server_error:
        return internal_server_error
    studenti = pridej_datum_splneni_do_listu_studentu(studenti, id_terminu)
    if studenti == internal_server_error:
        return internal_server_error
    termin_info = get_termin_info(session, id_terminu)
    if termin_info == internal_server_error:
        return internal_server_error
    return {"studenti": studenti, "termin": termin_info}


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
        if pomocny_list == internal_server_error:
            return internal_server_error
        predmety = ";".join(pomocny_list) # type: ignore
    list_predmetu = predmety.split(";") # type: ignore
    list_terminu = []
    vyucujici_list = read_file()
    for predmet in list_predmetu:
        predmet = get_kod_predmetu_by_zkratka(session, predmet)
        if predmet == internal_server_error:
            return internal_server_error
        list_terminu.extend(list_probehle_terminy_predmet(session, predmet))
        list_terminu.extend(list_planovane_terminy_predmet(session, predmet))
    list_terminu = pridat_vyucujici_k_terminu(list_terminu, vyucujici_list)
    return list_terminu


@app.post("/ucitel/termin")
async def ucitel_vytvor_termin(ticket: str, termin: tTermin):
    """ Učitel vytvoří termín do databáze """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    vypsal_id, role = encode_id(info[0]), info[1]

    if termin.kod_predmetu is None:
        return not_found

    if not termin.vyucuje_prijmeni:
        vyucuje_id = get_vyucujiciho_by_predmet(session, termin.kod_predmetu)[0] # type: ignore
        if vyucuje_id == internal_server_error:
            return internal_server_error
# TODO: vymyslet, jak se bude vkládat id vyučujícího bez toho, aniž by admin, který není vyučující termínu, ale vypisující, mohl vypsat termín na 1 vyučujícího
# navrh: random()


    else:
        vyucuje_id = vypsal_id

    message = vypsat_termin(session, termin.ucebna, termin.datum_start, termin.datum_konec, termin.max_kapacita, vypsal_id, vyucuje_id, termin.kod_predmetu, termin.jmeno, termin.cislo_cviceni, termin.popis) # type: ignore
    return message
    # if message is not ok:
    #     return message
    # elif upozornit:
    #     katedra = get_katedra_by_predmet(session, zkratka_predmetu)
    #     kod_predmetu = katedra + "/" +zkratka_predmetu # type: ignore
    #     list_emailu = get_list_emailu_by_predmet(session, kod_predmetu, cislo_cviceni)
    #     if list_emailu == []:
    #         return not_found
    #     return list_emailu
    # else:
    #     return ok


#@app.post("/ucitel/termin")
#async def ucitel_vytvor_termin(ticket: str, ucebna:str, datum_start: datetime, datum_konec:datetime, max_kapacita:int, zkratka_predmetu: str, jmeno: str, cislo_cviceni: int,popis:str,upozornit: Optional[bool] = None, vyucuje_prijmeni: Optional[str] = None):
#    """ Učitel vytvoří termín do databáze """
#    info = kontrola_ticketu(ticket, vyucujici=True)
#    if info == unauthorized or info == internal_server_error:
#        return info
#    vypsal_id, role = encode_id(info[0]), info[1]
#
#    kod_predmetu = get_kod_predmetu_by_zkratka(session, zkratka_predmetu)
#    if kod_predmetu is None:
#        return conflict
#    katedra = get_katedra_by_predmet(session, zkratka_predmetu)
#    if vyucuje_id is None:
#        vyucuje_id = get_vyucujiciho_by_predmet(session, kod_predmetu) # type: ignore
#    vyucuje_id = encode_id(vyucuje_id)
#    message = vypsat_termin(session, ucebna, datum_start, datum_konec, max_kapacita, vypsal_id, vyucuje_id, kod_predmetu, jmeno, cislo_cviceni, popis) # type: ignore
#    if message is not ok:
#        return message
#    elif upozornit:
#        emaily = get_list_emailu_pro_cviceni(session, kod_predmetu, cislo_cviceni, ticket)
#        return emaily
#    else:
#        return ok


@app.patch("/ucitel/termin")
async def ucitel_zmena_terminu(
    ticket: str,
    id_terminu: str,
    termin: tTermin
    ):
    """ Učitel změní parametry v již vypsaném termínu """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    message = upravit_termin(session, id_terminu, newStartDatum=termin.datum_start,newKonecDatum=termin.datum_konec, newUcebna=termin.ucebna, newMax_kapacita=termin.max_kapacita, newJmeno=termin.jmeno, cislo_cviceni=termin.cislo_cviceni,newPopis=termin.popis)
    return message


@app.delete("/ucitel/termin")
async def ucitel_smazani_terminu(ticket: str, id_terminu: str):
    """ Učitel smáže vypsaný termín """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    
    res = smazat_termin(session, id_terminu)
    return res


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
    if vsechny_terminy == internal_server_error:
        return internal_server_error
    if id_terminu not in vsechny_terminy:
        return bad_request

    list_studentu = list_studenti_z_terminu(session, id_terminu)
    if list_studentu == internal_server_error:
        return internal_server_error
    vystup = get_katedra_predmet_by_idterminu(session, id_terminu)
    if vystup is None:
        return not_found
    elif vystup == internal_server_error:
        return internal_server_error

    jmena_studentu = get_list_studentu(ticket, list_studentu, vystup)
    return jmena_studentu
        # vraci list {osCislo: {jmeno: , prijmeni: , email: }}


@app.get("/ucitel/student")
async def get_ucitel_studenta(ticket: str, id_stud: str):
    """ Vrátí informace o studentovi 
    Args:
        id_studenta: Jeho osobní číslo"""

    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    predmety_studenta = get_student_predmety(ticket, id_stud, get_vsechny_predmety_obj(session))
    if predmety_studenta is not_found:
        return not_found

    student_info = {"osCislo": id_stud}
    try:
        student_info["jmeno"], student_info["prijmeni"], student_info["email"]= get_student_info(ticket, id_stud)
    except:
        return not_found #spatne jmeno studenta
    

    id_stud = encode_id(id_stud)
    vyucujici_list = read_file()
    list_terminu = get_termin_zapsane_by_studentid(session, id_stud)
    if list_terminu == internal_server_error:
        return internal_server_error
    terminy_prihlaseny = pridat_vyucujici_k_terminu(list_terminu, vyucujici_list)

    vyhodnoceni = vyhodnoceni_studenta(session, id_stud, pocet_cviceni_pro_predmet(session))
    if vyhodnoceni == internal_server_error:
        return internal_server_error
    list_terminu = pridat_vyucujici_k_terminu(list_dostupnych_terminu(session, predmety_studenta, vyhodnoceni, id_stud), vyucujici_list)

    student_full = {"info": student_info, "dostupne_terminy": list_terminu, "terminy_prihlaseny": terminy_prihlaseny, "predmety": predmety_studenta}

    return student_full


@app.post("/ucitel/zapis")
async def post_ucitel_zapsat_studenta(ticket: str, id_stud: str, id_terminu: str): #ticket: str | None = None, id_stud: str | None = None
    """ Ručně přihlásí studenta do vypsaného termínu cvičení

    Args: id_studenta je jeho Fčíslo s F na začátku! [F*****] (nutno připsat dovnitř vstupu)"""
    # ticket = os.getenv("TICKET")
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    id_stud = encode_id(id_stud)
    message = pridat_studenta(session, id_stud, id_terminu)
    return message


@app.post("/ucitel/splneno")
async def post_ucitel_splnit_studentovi(ticket: str, id_stud: str, id_terminu: str): #ticket: str | None = None, id_stud: str | None = None, date: date
    """ Zapsat studentovi, že má splněný určitý termín cvičení """
    # ticket = os.getenv("TICKET")
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    id_stud = encode_id(id_stud)
    message = uznat_termin(session, id_terminu, id_stud)
    return message


@app.post("/ucitel/uznat")
async def post_ucitel_uznat_studentovi(ticket: str, id_stud: str, zkratka_predmetu: str):
    """ Uznat studentovi všechna cvičení dle zkratky předmětu """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    id_stud = encode_id(id_stud)
    id_terminu = get_uznavaci_termin_by_zkratka(session, zkratka_predmetu)
    if id_terminu == internal_server_error:
        return internal_server_error
    elif id_terminu is None:
        return not_found
    message = pridat_studenta(session, id_stud, id_terminu)
    if message != ok:
        return message
    session.commit()
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
    if list_studentu == internal_server_error:
        return internal_server_error

    vystup = get_katedra_predmet_by_idterminu(session, id_terminu)
    if vystup is None:
        return not_found
    elif vystup == internal_server_error:
        return internal_server_error
    emaily_studentu = get_list_studentu(ticket, list_studentu, vystup)
    return emaily_studentu
        # vraci: {osobniCislo: , jemno: , prijmeni:, email: }


@app.get("/ucitel/uspesni_studenti")
async def get_uspesni_studenti_by_predmet(ticket: str, zkratka_predmetu: str, zkratka_katedry: str):
    """ Vrátí seznam studentů, kteří mají všechny cvičení splněné z daného předmětu"""
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    vypis_uspesnych = list((vypis_uspesnych_studentu(session, zkratka_predmetu)).keys())
    if vypis_uspesnych == internal_server_error:
        return internal_server_error
    vystup = [zkratka_predmetu, zkratka_katedry]
    studenti = get_list_studentu(ticket, vypis_uspesnych, vystup)

    return studenti


@app.post("/ucitel/pridat_predmet")
async def post_pridat_predmet(ticket: str, zkratka_predmetu: str, katedra: str, pocet_cviceni: int, vyucuje_id: Optional[str] = None):
    """Vytvoří předmět - admin akce
    Args:
        ticket,
        zkratka predmetu,
        zkratka katedry,
        pocet_cviceni,
        vyucuje_id : id vyučujícího ... když se nechá prázný, bude bráno ID admina,
    """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    id_vypsal, role = encode_id(info[0]), info[1]

    kod_predmetu = katedra + "/" + zkratka_predmetu
    if vyucuje_id is None:
        vyucuje_id = id_vypsal
    else:
        vyucuje_id = encode_id(vyucuje_id)

    if not bool_existuje_predmet(ticket, katedra, zkratka_predmetu):
        return bad_request

    message = vytvor_predmet(session, kod_predmetu, zkratka_predmetu, katedra, vyucuje_id, pocet_cviceni)

    if message == ok:
        vyucujici_k_predmetum_to_txt(session)
        session.commit()
        datum_start = datetime.now()
        datum_konec = datetime.now() + timedelta(hours=2)
        message = vypsat_termin(session, "Nespecifikovano", datum_start, datum_konec, 1, id_vypsal, vyucuje_id, kod_predmetu, "Uznání předmětu", -1, "Cvičení pro uznání všech cvičení v rámci předmětu") # type: ignore

        return message

    else:
        return message

@app.get("/invalidate")
def invalidate(ticket: str):
    url = os.getenv("STAG_URL") + "ws/services/rest2/help/invalidateTicket?ticket=" + ticket

    response = requests.get(url)
    return 200


@app.get("/")
def root():
    termin = "c5d0c8c6-3c0b-4cac-b053-5f6d301a2f43"
    list = list_studenti_z_terminu(session, termin)
    return list

    # return emails






if __name__ == "__main__":
    dotenv.load_dotenv()

    if session:
        print("Session successfully created!")
    else:
        raise Exception("Session creation failed!")
    #vyucujici_k_predmetum_to_txt(session)

    uvicorn.run(app, host=os.getenv('HOST'), port=int(os.getenv('PORT'))) # type: ignore

