from fastapi import APIRouter
from classes.server_utils import *
from lib.db_terminy import *

router = APIRouter()


@router.get("/admin")
async def get_admin_board(ticket: str | None = None):
    """ Vrátí všechny vypsané cvičení """

    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), info[1]

    list_terminu = list_terminy(session)
    if list_terminu == internal_server_error:
        return internal_server_error
    vyucujici_list = read_file()
    list_terminu = pridat_vyucujici_k_terminu(list_terminu, vyucujici_list)

    return list_terminu