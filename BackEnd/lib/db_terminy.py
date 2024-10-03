from conn import *

def list_terminy(session):
    """ Vrátí všechny vypsané termíny """
    terminy = session.query(Termin).order_by(Termin.datum_start.desc())
    termin_list = [termin for termin in terminy]
    return termin_list


def list_studenti_z_terminu(session, termin_id):
    """ Vrátí všechny studenty, kteří jsou zapsáni na termínu podle id termínu"""
    student_list = session.query(HistorieTerminu).filter(HistorieTerminu.termin_id == termin_id).all()
    studenti_list = [student.student_id for student in student_list]
    return studenti_list


def list_nadchazejici_terminy(session):
    """ Vrátí všechny nadcházející termíny """
    dnesni_datum = datetime.now()
    terminy = session.query(Termin).filter(Termin.datum_start >= dnesni_datum).order_by(Termin.datum_start.asc())
    terminy_list = [termin for termin in terminy]
    return terminy_list


def list_probehle_terminy(session):
    """ Vrátí všechny proběhle termíny """
    dnesni_datum = datetime.now()
    terminy = session.query(Termin).filter(Termin.datum_start <= dnesni_datum).order_by(Termin.datum_start.desc())
    for termin in terminy:
        print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Date: {termin.datum_start}, Room: {termin.ucebna}")
    terminy_list = [termin for termin in terminy]
    return terminy_list


def list_planovane_terminy_predmet(session, kod_predmetu):
    dnesni_datum = datetime.now()
    terminy = session.query(Termin).filter(and_(Termin.kod_predmet == kod_predmetu, Termin.datum_start >= dnesni_datum)).order_by(Termin.datum_start.asc())
    terminy_list = [termin for termin in terminy]
    return terminy_list


def list_probehle_terminy_predmet(session, kod_predmetu):
    dnesni_datum = datetime.now()
    terminy = session.query(Termin).filter(and_(Termin.kod_predmet == kod_predmetu, Termin.datum_start <= dnesni_datum)).order_by(Termin.datum_start.desc())
    terminy_list = [termin for termin in terminy]
    return terminy_list