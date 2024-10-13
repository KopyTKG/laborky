from lib.conn import *

def list_terminy(session):
    """ Vrátí všechny vypsané termíny """
    try:
        terminy = session.query(Termin).order_by(Termin.datum_start.desc())
        termin_list = [termin for termin in terminy]
        return termin_list
    except: 
        return internal_server_error


def list_studenti_z_terminu(session, termin_id):
    """ Vrátí všechny studenty, kteří jsou zapsáni na termínu podle id termínu"""
    try:

        student_list = session.query(HistorieTerminu).filter(HistorieTerminu.termin_id == termin_id).all()
        studenti_list = [student.student_id for student in student_list]
        return studenti_list
    except:
        return internal_server_error


def list_nadchazejici_terminy(session):
    """ Vrátí všechny nadcházející termíny """
    try:
        dnesni_datum = datetime.now()
        terminy = session.query(Termin).filter(Termin.datum_konec >= dnesni_datum).filter(Termin.cislo_cviceni != -1).order_by(Termin.datum_start.asc())
        terminy_list = [termin for termin in terminy]
        return terminy_list
    except:
        return internal_server_error


def list_probehle_terminy(session):
    """ Vrátí všechny proběhle termíny """
    try:
        dnesni_datum = datetime.now()
        terminy = session.query(Termin).filter(and_(Termin.datum_konec <= dnesni_datum, Termin.cislo_cviceni != -1)).order_by(Termin.datum_start.desc())
        terminy_list = [termin for termin in terminy]
        return terminy_list
    except:
        return internal_server_error


def list_planovane_terminy_predmet(session, kod_predmetu):
    """ Vrátí všechny plánované termíny dle předmětu"""
    try:
        dnesni_datum = datetime.now()
        terminy = session.query(Termin).filter(and_(Termin.kod_predmet == kod_predmetu, Termin.datum_konec >= dnesni_datum, Termin.cislo_cviceni != -1)).order_by(Termin.datum_start.asc())
        terminy_list = [termin for termin in terminy]
        return terminy_list
    except:
        return internal_server_error


def list_probehle_terminy_predmet(session, kod_predmetu):
    """ Vrátí všechny proběhlé termíny dle předmětu """
    try:
        dnesni_datum = datetime.now()
        terminy = session.query(Termin).filter(and_(Termin.kod_predmet == kod_predmetu, Termin.datum_konec <= dnesni_datum, Termin.cislo_cviceni != -1)).order_by(Termin.datum_start.desc())
        terminy_list = [termin for termin in terminy]
        return terminy_list
    except:
        return internal_server_error


def terminy_dopredu_pro_vyucujiciho(session, id):
    """ Vrátí všechny termíny, které bude vyucujíčí dle ID"""
    try:
        start_date = datetime.now()
        end_date = start_date + timedelta(days=interval_vypisu_terminu)
        terminy = session.query(Termin).filter(and_(Termin.datum_start >= start_date, Termin.datum_konec <= end_date, Termin.vyucuje_id == id, Termin.cislo_cviceni != -1)).order_by(Termin.datum_start.asc())
        terminy_list = [termin for termin in terminy]
        return terminy_list
    except:
        return internal_server_error


def terminy_dopredu(session):
    try:
        start_date = datetime.now()
        end_date = start_date + timedelta(days=interval_vypisu_terminu)
        terminy = session.query(Termin).filter(and_(Termin.datum_konec <= end_date, Termin.cislo_cviceni != -1)).order_by(Termin.datum_start.asc())
        terminy_list = [termin for termin in terminy]
        return terminy_list
    except:
        return internal_server_error


def list_terminy_vyucujici(session, id):
    try:
        terminy = session.query(Termin).filter(Termin.vyucuje_id == id, Termin.cislo_cviceni != -1).order_by(Termin.datum_start.desc())
        if terminy is None:
            print("Vyucujici nema naplanovane zadne terminy, nebo jeho ID neexistuje!")
            return False
        for termin in terminy:
            print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Date: {termin.datum_start}, Room: {termin.ucebna}")
        terminy_list = [termin for termin in terminy]
        return terminy_list
    except:
        return internal_server_error


def list_dostupnych_terminu(session, predmety, historie_predmetu, id_studenta, po_startu=False):
    try:
        current_date = datetime.now()

        if po_startu:
            terminy = session.query(Termin).filter(
                and_(
                    Termin.kod_predmet.in_(predmety),  
                    Termin.cislo_cviceni != -1  
                )
            ).order_by(Termin.datum_start.desc()).all()

        else:
            terminy = session.query(Termin).filter(
                and_(
                    Termin.kod_predmet.in_(predmety),  
                    Termin.datum_start > current_date - timedelta(hours=1),
                    Termin.cislo_cviceni != -1  
                )
            ).order_by(Termin.datum_start.desc()).all()

        terminy_list = []

        for termin in terminy:
            kod_predmetu = termin.kod_predmet
            cislo_cviceni = termin.cislo_cviceni

            if kod_predmetu in historie_predmetu:
                if historie_predmetu[kod_predmetu][cislo_cviceni - 1] != 0:
                    continue  # Skip this term since the student already completed it

            already_registered = session.query(HistorieTerminu).join(Termin).filter(
                and_(
                    HistorieTerminu.student_id == id_studenta,
                    Termin.kod_predmet == kod_predmetu,
                    Termin.cislo_cviceni == cislo_cviceni
                )
            ).first()

            if already_registered:
                continue

            attended = session.query(HistorieTerminu).filter(
                and_(
                    HistorieTerminu.student_id == id_studenta,
                    HistorieTerminu.termin_id == termin.id
                )
            ).first()

            if attended is None:
                terminy_list.append(termin)

        return terminy_list

    except:
        return internal_server_error