from fastapi import APIRouter
from classes.server_utils import *
from lib.db_terminy import *


router = APIRouter()


@router.get("/ucitel/moje")
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