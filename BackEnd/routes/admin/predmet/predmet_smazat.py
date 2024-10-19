from fastapi import APIRouter
from classes.server_utils import *
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter()


@router.delete("/admin/predmet")
async def delete_predmet(ticket: str, zkratka_predmetu: str, katedra: str):
    """ Vymaže předmět podle kódu předmětu - admin akce """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    vystup = smazat_predmet(session, katedra, zkratka_predmetu)
    return vystup