from fastapi import APIRouter # type: ignore
from classes.server_utils import *
from lib.db_terminy import *



router = APIRouter()


@router.get("/ucitel/student")
async def get_ucitel_studenta(ticket: str, id_stud: str):
    """ Vrátí informace o studentovi 
    Args:
        id_studenta: Jeho osobní číslo"""
    id_stud = id_stud.upper()
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

    student_db = get_student_by_id(session, id_stud)
    if student_db == None or student_db == not_found:
        message = vytvor_student(session, id_stud)
        print("student nebyl v DB")
        if message != ok:
            return message


    vyhodnoceni_vsech_predmetu = vyhodnoceni_studenta(session, id_stud, pocet_cviceni_pro_predmet(session))
    if vyhodnoceni_vsech_predmetu == internal_server_error:
            return internal_server_error
    vyhodnoceni = {}

    for predmet in predmety_studenta:
        if predmet in list(vyhodnoceni_vsech_predmetu.keys()):
            vyhodnoceni[predmet] = vyhodnoceni_vsech_predmetu[predmet]

    student_full = {"info": student_info, "profil": vyhodnoceni}

    return student_full