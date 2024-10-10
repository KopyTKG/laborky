from fastapi import APIRouter
from classes.server_utils import *


router = APIRouter()


@router.delete("/ucitel/termin")
async def ucitel_smazani_terminu(ticket: str, id_terminu: str):
    """ Učitel smáže vypsaný termín """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    
    res = smazat_termin(session, id_terminu)
    return res