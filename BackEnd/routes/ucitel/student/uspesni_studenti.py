from fastapi import APIRouter
from classes.server_utils import *


router = APIRouter()


@router.get("/ucitel/uspesni_studenti")
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