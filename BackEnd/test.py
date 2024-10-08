from classes.vyucujici import *
from lib.conn import *
from classes.server_utils import *
def get_list_emailu_by_predmet(session, zkratka_predmetu: str, katedra: str,  index_cviceni: int, ticket: str = None):
    try:
        predmety_k_dispozici = get_predmet_student_k_dispozici(ticket, get_vsechny_predmety(session))
        kod_predmetu = zkratka_predmetu + katedra
        studenti_co_maji_ziskat_email = session.query(Student.id).outerjoin(ZapsanePredmety, ZapsanePredmety.student_id == Student.id).outerjoin(Predmet, Predmet.kod_predmetu == ZapsanePredmety.kod_predmet).outerjoin(HistorieTerminu, HistorieTerminu.student_id == Student.id).outerjoin(Termin, Termin.id == HistorieTerminu.termin_id).filter(Predmet.kod_predmetu == kod_predmetu,Termin.cislo_cviceni == index_cviceni,HistorieTerminu.datum_splneni == None,).filter(not_(session.query(Termin).join(HistorieTerminu, HistorieTerminu.termin_id == Termin.id).filter(Termin.cislo_cviceni == -1,HistorieTerminu.datum_splneni == None,).exists())).all()
        if studenti_co_maji_ziskat_email is None:
            return not_found
        hash_list = [row[0].strip() for row in studenti_co_maji_ziskat_email]
        vsichni_studenti = get_studenti_na_predmetu(ticket, katedra, zkratka_predmetu)
        if vsichni_studenti is None:
            return not_found # not here
        os_cisla = compare_encoded(hash_list, vsichni_studenti)
        if os_cisla is None:
            return not_found # not here
        list_emailu = []
        for student in os_cisla:
            jmeno, prijmeni, email = get_student_info(ticket, student)
            list_emailu.append(email)
        if list_emailu == []:
            return not_found # not here either?
        else: 
            return list_emailu, os_cisla
    except Exception as e:
        return e

list_emailu, os_cisla = get_list_emailu_by_predmet(session, "PF", "KAP", 1, "be0d086d5ef502aa3ecf2ad6ca1fa940145ded4650fa96eec5e9dc877eb4689b")
