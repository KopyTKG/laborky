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
    """ Vrátí všechny plánované termíny dle předmětu"""
    dnesni_datum = datetime.now()
    terminy = session.query(Termin).filter(and_(Termin.kod_predmet == kod_predmetu, Termin.datum_start >= dnesni_datum)).order_by(Termin.datum_start.asc())
    terminy_list = [termin for termin in terminy]
    return terminy_list


def list_probehle_terminy_predmet(session, kod_predmetu):
    """ Vrátí všechny proběhlé termíny dle předmětu """
    dnesni_datum = datetime.now()
    terminy = session.query(Termin).filter(and_(Termin.kod_predmet == kod_predmetu, Termin.datum_start <= dnesni_datum)).order_by(Termin.datum_start.desc())
    terminy_list = [termin for termin in terminy]
    return terminy_list


def terminy_dopredu_pro_vyucujiciho(session, id):
    """ Vrátí všechny termíny, které bude vyucujíčí dle ID"""
    start_date = datetime.now()
    end_date = start_date + timedelta(days=interval_vypisu_terminu)
    terminy = session.query(Termin).filter(and_(Termin.datum_start >= start_date, Termin.datum_start <= end_date, Termin.vyucuje_id == id)).order_by(Termin.datum_start.asc())
    terminy_list = [termin for termin in terminy]
    return terminy_list


def terminy_dopredu(session):
    start_date = datetime.now()
    end_date = start_date + timedelta(days=interval_vypisu_terminu)
    terminy = session.query(Termin).filter(and_(Termin.datum_start >= start_date, Termin.datum_start <= end_date)).order_by(Termin.datum_start.asc())
    terminy_list = [termin for termin in terminy]
    return terminy_list


def list_terminy_vyucujici(session, id):
    terminy = session.query(Termin).filter(Termin.vyucuje_id == id).order_by(Termin.datum_start.desc())
    if terminy is None:
        print("Vyucujici nema naplanovane zadne terminy, nebo jeho ID neexistuje!")
        return False
    for termin in terminy:
        print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Date: {termin.datum_start}, Room: {termin.ucebna}")
    terminy_list = [termin for termin in terminy]
    return terminy_list


def list_dostupnych_terminu(session, predmety, historie_predmetu, id_studenta):
    current_date = datetime.now()

    terminy = session.query(Termin).filter(
        and_(
            Termin.kod_predmet.in_(predmety),  # Only terms from the specified subjects
            Termin.datum_start > current_date - timedelta(hours=1),  # Terms that have not passed yet and the ones that barely started (1 hour ago eg.)
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