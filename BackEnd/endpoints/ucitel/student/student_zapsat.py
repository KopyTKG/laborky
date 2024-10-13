from fastapi import APIRouter
from classes.server_utils import *


router = APIRouter()


@router.post("/ucitel/zapis")
async def post_ucitel_zapsat_studenta(ticket: str, id_stud: str, id_terminu: str): #ticket: str | None = None, id_stud: str | None = None
    """ Ručně přihlásí studenta do vypsaného termínu cvičení

    Args: id_studenta je jeho osobní číslo"""

    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    id_stud = id_stud.upper()
    predmety_studenta = get_student_predmety(ticket, id_stud, get_vsechny_predmety_obj(session))
    termin = get_termin_info(session, id_terminu)

    if termin.kod_predmet not in predmety_studenta:
        return conflict
    
    id_stud = encode_id(id_stud)
    if get_student_by_id(session, id_stud) == not_found:
        return not_found

    message = pridat_studenta(session, id_stud, id_terminu)
    return message
