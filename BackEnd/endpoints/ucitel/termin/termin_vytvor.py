from fastapi import APIRouter
from classes.server_utils import *


router = APIRouter()


@router.post("/ucitel/termin")
async def ucitel_vytvor_termin(ticket: str, termin: tTermin):
    """ Učitel vytvoří termín do databáze """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    vypsal_id, role = encode_id(info[0]), info[1]
    print(termin)
    if termin.kod_predmetu is None:
        return not_found

    if not termin.vyucuje_prijmeni:
        vyucuje_id = get_vyucujiciho_by_predmet(session, termin.kod_predmetu)
        if vyucuje_id == internal_server_error or not vyucuje_id:
            return internal_server_error
        vyucuje_id = vyucuje_id[0] # type: ignore

# TODO: vymyslet, jak se bude vkládat id vyučujícího bez toho, aniž by admin, který není vyučující termínu, ale vypisující, mohl vypsat termín na 1 vyučujícího
# navrh: random()


    else:
        vyucuje_id = vypsal_id

    message = vypsat_termin(session, termin.ucebna, termin.datum_start, termin.datum_konec, termin.max_kapacita, vypsal_id, vyucuje_id, termin.kod_predmetu, termin.jmeno, termin.cislo_cviceni, termin.popis) # type: ignore
    return message
#TODO: upozornění emailů
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
