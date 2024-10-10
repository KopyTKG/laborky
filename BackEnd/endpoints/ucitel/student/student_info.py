from fastapi import APIRouter
from classes.server_utils import *
from lib.db_terminy import *



router = APIRouter()


@router.get("/ucitel/student")
async def get_ucitel_studenta(ticket: str, id_stud: str):
    """ Vrátí informace o studentovi 
    Args:
        id_studenta: Jeho osobní číslo"""

    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info

    predmety_studenta = get_student_predmety(ticket, id_stud, get_vsechny_predmety_obj(session))
    if predmety_studenta is not_found:
        return not_found

    student_info = {"osCislo": id_stud}
    try:
        student_info["jmeno"], student_info["prijmeni"], student_info["email"]= get_student_info(ticket, id_stud)
    except:
        return not_found #spatne jmeno studenta
    

    id_stud = encode_id(id_stud)
    vyucujici_list = read_file()
    list_terminu = get_termin_zapsane_by_studentid(session, id_stud)
    if list_terminu == internal_server_error:
        return internal_server_error
    terminy_prihlaseny = pridat_vyucujici_k_terminu(list_terminu, vyucujici_list)

    vyhodnoceni = vyhodnoceni_studenta(session, id_stud, pocet_cviceni_pro_predmet(session))
    if vyhodnoceni == internal_server_error:
        return internal_server_error
    list_terminu = pridat_vyucujici_k_terminu(list_dostupnych_terminu(session, predmety_studenta, vyhodnoceni, id_stud), vyucujici_list)

    student_full = {"info": student_info, "dostupne_terminy": list_terminu, "terminy_prihlaseny": terminy_prihlaseny, "predmety": predmety_studenta}

    return student_full