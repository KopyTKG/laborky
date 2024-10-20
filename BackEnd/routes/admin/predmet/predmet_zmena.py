from fastapi import APIRouter
from classes.server_utils import *
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter()


@router.patch("/admin/predmet")
async def update_predmet(ticket: str, kod_predmetu:str, predmet: tPredmet):
    """ Změní údaje vypsaného předmětu - admin akce """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    vystup = upravit_predmet(session, kod_predmetu, newZkratkaPredmetu=predmet.zkratka_predmetu, newKatedra=predmet.katedra, newPocetCviceni=predmet.pocet_cviceni)

    return vystup