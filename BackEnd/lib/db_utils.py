from lib.conn import *

def get_vyucujiciho_by_predmet(session, kod_predmetu):
    """ Vrátí zahashované id vyučujících, kteří vyučují daný předmět"""
    vyucujici_list = []
    predmet = session.query(VyucujiciPredmety).filter_by(kod_predmetu=kod_predmetu).all()
    for vyucujici in predmet:
        vyucujici_list.append(vyucujici.vyucujici_id)
    if vyucujici_list:
        return vyucujici_list
    return None


def get_vsechny_predmety_obj(session):
    """ Vrátí vsechny predmety """
    predmety = session.query(Predmet).all()
    return predmety


# tohle je obsolete imho
def get_predmet_by_id(session, id_predmetu):
    """ Vrátí kód předmětu podle jeho identifikačního kódů """
    predmet = session.query(Predmet).filter_by(kod_predmetu=id_predmetu).first()
    if predmet:
        return predmet
    return None


def get_katedra_predmet_by_idterminu(session, id_terminu):
    """ Vrátí zkratku předmětu a zkratku katedry podle id termínu """
    termin = session.query(Termin).filter_by(id=id_terminu).first()
    if termin:
        predmet = termin.predmet
        if predmet:
            return predmet.zkratka_predmetu, predmet.katedra
    return None


def get_katedra_predmet_by_kod(session, kod_predmetu):
    """ vrátí zkratku katedry a zkratku predmetu podle kodu predmetu """
    predmet = session.query(Predmet).filter_by(kod_predmetu=kod_predmetu).first()
    if predmet:
        return [str(predmet.katedra), str(predmet.zkratka_predmetu)]
    return None


def get_katedra_by_predmet(session, zkratka_predmetu):
    predmet = session.query(Predmet).filter_by(zkratka_predmetu=zkratka_predmetu).first()
    if predmet:
        return str(predmet.katedra)
    return None


def get_kod_predmetu_by_zkratka(session, zkratka_predmetu):
    """ Vrátí kód předmětu podle zkratky předmětu """
    predmet = session.query(Predmet).filter_by(zkratka_predmetu=zkratka_predmetu).first()
    if predmet:
        return predmet.kod_predmetu
    return None


def get_kod_predmetu_by_id(session, id_predmetu):
    """ Vrátí kód předmětu podle id """
    predmet = session.query(Predmet).filter_by(id=id_predmetu).first()
    if predmet:
        return predmet.kod_predmetu
    return None


def get_vsechny_terminy(session):
    """ Vrátí všechny vypsané termíny """
    terminy = session.query(Termin).all()
    return [str(termin.id) for termin in terminy]


def get_vsechny_predmety(session):
    """ Vrátí zkratky předmětů všech různých předmětů """
    predmety = session.query(Predmet.zkratka_predmetu).all()
    return [predmet.zkratka_predmetu for predmet in predmety]


def get_vsechny_predmety_kod_katedra(session):
    """ Vrátí zkratky a katedry předmětů všech různých předmětů """
    predmety = session.query(Predmet).all()
    return [(predmet.zkratka_predmetu, predmet.katedra) for predmet in predmety]


def subtract_lists(list1, list2):
    """ Odečítání listů (vrátí první list ochuzený o prvky z prvního listu)"""
    result = list(set(list1) - set(list2))
    return result


def get_uznavaci_termin_by_zkratka(session, zkratka_predmetu):
    """ Vrátí id uznačovacího terminu podle zkratky předmětu """
    kod_predmetu = get_kod_predmetu_by_zkratka(session, zkratka_predmetu)
    termin = session.query(Termin).filter(and_(Termin.kod_predmet==kod_predmetu, Termin.cislo_cviceni==-1)).first()
    if termin is not None:
        return termin.id
    return None

def get_list_emailu_pro_cviceni(session,kod_predmetu:str, index_cviceni: int, ticket: str = None):
    try:
        info = get_predmet_by_id(session, kod_predmetu)
        katedra, zkratka = info.katedra, info.zkratka_predmetu
        kandidati_na_email = get_studenti_na_predmetu(ticket, katedra, zkratka)
        if kandidati_na_email is None:
            return not_found # zadny studenti nemaji zapsany predmet

        terminy_predmetu = select(Termin.id).filter(
        Termin.kod_predmet == kod_predmetu,
        Termin.cislo_cviceni == index_cviceni
        )

        studenti_co_maji_ziskat_email = session.query(Student.id).outerjoin(HistorieTerminu).filter(
        (HistorieTerminu.termin_id.is_(None)) |  # No attendance (no entry in HistorieTerminu)
        (HistorieTerminu.termin_id.in_(terminy_predmetu) & HistorieTerminu.datum_splneni.is_(None))  # Attended but didn't complete
        ).all()

        email_list = []

        for student in studenti_co_maji_ziskat_email:
            email_list.append(student[0])

        if email_list is None:
            print("query je prazdna")
            return not_found
        os_cisla = compare_encoded(email_list, kandidati_na_email)
        print(os_cisla)
        if os_cisla is None:
            return not_found # not here
        list_emailu = []
        for student in os_cisla:
            jmeno, prijmeni, email = get_student_info(ticket, student)
            list_emailu.append(email)
        if list_emailu == []:
            return not_found # not here either?
        else:
            return list_emailu
    except Exception as e:
        return e
