from fastapi import APIRouter
from classes.server_utils import *


router = APIRouter()


@router.patch("/ucitel/termin")
async def ucitel_zmena_terminu(
    ticket: str,
    id_terminu: str,
    termin: tTermin
    ):
    """ Učitel změní parametry v již vypsaném termínu """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    if termin.datum_start > termin.datum_konec:
        promenna_na_prohazeni = termin.datum_start
        termin.datum_start = termin.datum_konec
        termin.datum_konec = promenna_na_prohazeni

    message = upravit_termin(session, id_terminu, newStartDatum=termin.datum_start,newKonecDatum=termin.datum_konec, newUcebna=termin.ucebna, newMax_kapacita=termin.max_kapacita, newJmeno=termin.jmeno, cislo_cviceni=termin.cislo_cviceni,newPopis=termin.popis)
    return message