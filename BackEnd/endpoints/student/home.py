from fastapi import APIRouter
from classes.server_utils import *
from classes.vyucujici import *
from classes.student import *
from lib.db_terminy import *
from lib.db_utils import *


router = APIRouter()

@router.get("/student") #/student/{osobni_cislo}
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

    for termin in list_terminu:
        predmet = get_predmet_by_id(session, termin.kod_predmet)
        termin.predmet_terminu = predmet

    vyucujici_list = read_file()
    list_terminu = pridat_vyucujici_k_terminu(list_terminu, vyucujici_list)

    return list_terminu