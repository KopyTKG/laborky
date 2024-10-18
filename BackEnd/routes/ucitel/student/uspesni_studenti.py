from fastapi import APIRouter
from classes.server_utils import *


router = APIRouter()


@router.get("/ucitel/uspesni_studenti")
async def get_uspesni_studenti_by_predmet(ticket: str, kod_predmetu: str):
    """ Vrátí seznam studentů, kteří mají všechny cvičení splněné z daného předmětu"""
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    vypis_uspesnych = list((vypis_uspesnych_studentu(session, kod_predmetu)).keys())
    if vypis_uspesnych == internal_server_error:
        return internal_server_error
    
    vystup = get_katedra_predmet_by_kod(session, kod_predmetu)
    vystup[0], vystup[1] = vystup[1], vystup[0]

    studenti = get_list_studentu(ticket, vypis_uspesnych, vystup)

    return {"kod_predmetu": kod_predmetu, "studenti": studenti}