from fastapi import APIRouter
from classes.server_utils import *
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter()


@router.get("/admin/predmet")
async def get_predmet(ticket: str, zkratka_predmetu:str, katedra:str):
    """ Vrátí info o předmětu - admin akce """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    kod_predmetu = katedra + "/" + zkratka_predmetu
    vystup = get_predmet_by_id(session, kod_predmetu)
    if vystup == internal_server_error:
        return internal_server_error
    elif vystup is None:
        return not_found
    return {"predmet": vystup}