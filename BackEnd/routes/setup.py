from fastapi import APIRouter
from lib.db_utils import *
from classes.vyucujici import *
from classes.student import *
from classes.server_utils import *

router = APIRouter()

@router.get("/setup")
async def kontrola_s_db(ticket: str | None = None):
    """ Kontrola přihlášeného uživatele s databází po loginu do systému """
    info = kontrola_ticketu(ticket, vyucujici=False)
    if info == unauthorized or info == internal_server_error:
        return info
    userid, role = encode_id(info[0]), [info[1]]
    if "ST" not in role:
        message = vytvor_vyucujici(session, userid)
        if message != ok:
            return message
    else:
        message = vytvor_student(session, userid)
        if message == internal_server_error:
            return internal_server_error
    return info[0], role, userid