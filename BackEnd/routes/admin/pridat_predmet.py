from fastapi import APIRouter
from classes.server_utils import *
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter()


@router.post("/ucitel/pridat_predmet")
async def post_pridat_predmet(ticket: str, zkratka_predmetu: str, katedra: str, pocet_cviceni: int, vyucuje_id: Optional[str] = None):
    """Vytvoří předmět - admin akce
    Args:
        ticket,
        zkratka predmetu,
        zkratka katedry,
        pocet_cviceni,
        vyucuje_id : id vyučujícího ... když se nechá prázný, bude bráno ID admina,
    """
    info = kontrola_ticketu(ticket, vyucujici=True)
    if info == unauthorized or info == internal_server_error:
        return info
    id_vypsal, role = encode_id(info[0]), info[1]

    kod_predmetu = katedra + "/" + zkratka_predmetu
    if vyucuje_id is None:
        vyucuje_id = id_vypsal
    else:
        vyucuje_id = encode_id(vyucuje_id)

    if not bool_existuje_predmet(ticket, katedra, zkratka_predmetu):
        return bad_request

    message = vytvor_predmet(session, kod_predmetu, zkratka_predmetu, katedra, vyucuje_id, pocet_cviceni)

    if message == ok:
        vyucujici_k_predmetum_to_txt(session)
        session.commit()
        datum_start = datetime.now()
        datum_konec = datetime.now() + timedelta(hours=2)
        message = vypsat_termin(session, "Nespecifikovano", datum_start, datum_konec, 1, id_vypsal, vyucuje_id, kod_predmetu, "Uznání předmětu", -1, "Cvičení pro uznání všech cvičení v rámci předmětu") # type: ignore
        session.commit()

        if message == ok:
            studenti = get_studenti_na_predmetu(ticket, katedra, zkratka_predmetu)
            vsichni_studenti = get_studenti_all(session)

            for student in studenti:
                student_id = encode_id(student)

                if student_id not in vsichni_studenti:
                    message = vytvor_student(session, student_id)


        return message

    else:
        return message