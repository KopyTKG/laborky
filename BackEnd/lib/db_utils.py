from lib.conn import *

def get_vyucujiciho_by_predmet(session, kod_predmetu):
    """ Vrátí zahashované id vyučujících, kteří vyučují daný předmět"""
    try:
        vyucujici_list = []
        predmet = session.query(VyucujiciPredmety).filter_by(kod_predmetu=kod_predmetu).all()
        for vyucujici in predmet:
            vyucujici_list.append(vyucujici.vyucujici_id)
        if vyucujici_list:
            return vyucujici_list
        return None
    except:
        return internal_server_error


def get_vsechny_predmety_obj(session):
    """ Vrátí vsechny predmety """
    try:
        predmety = session.query(Predmet).all()
        return predmety
    except:
        return internal_server_error

# tohle je obsolete imho
def get_predmet_by_id(session, id_predmetu):
    """ Vrátí kód předmětu podle jeho identifikačního kódů """
    try:
        predmet = session.query(Predmet).filter_by(kod_predmetu=id_predmetu).first()
        if predmet:
            return predmet
        return None
    except:
        return internal_server_error


def get_termin_info(session, id_terminu):
    """ Vrátí informace o terminu """
    try:
        termin = session.query(Termin).filter_by(id=id_terminu).first()
        if termin:
            return termin
        return not_found
    except:
        return internal_server_error


def get_termin_zapsane_by_studentid(session, student_id):
    """ Vrátí terminy studenta podle ID """
    try:
        terminy = session.query(HistorieTerminu).filter(and_(HistorieTerminu.student_id == student_id, HistorieTerminu.datum_splneni == None)).all()
        return terminy
    except:
        return internal_server_error


def get_katedra_predmet_by_idterminu(session, id_terminu):
    """ Vrátí zkratku předmětu a zkratku katedry podle id termínu """
    try:
        termin = session.query(Termin).filter_by(id=id_terminu).first()
        if termin:
            predmet = termin.predmet
            if predmet:
                return predmet.zkratka_predmetu, predmet.katedra
        return None
    except:
        return internal_server_error


def get_katedra_predmet_by_kod(session, kod_predmetu):
    """ vrátí zkratku katedry a zkratku predmetu podle kodu predmetu """
    try:
        predmet = session.query(Predmet).filter_by(kod_predmetu=kod_predmetu).first()
        if predmet:
            return [str(predmet.katedra), str(predmet.zkratka_predmetu)]
        return None
    except:
        return internal_server_error


def get_katedra_by_predmet(session, zkratka_predmetu):
    """Vrátí Katedru pomocí zkratky předmětu"""
    try:
        predmet = session.query(Predmet).filter_by(zkratka_predmetu=zkratka_predmetu).first()
        if predmet:
            return str(predmet.katedra)
        return None
    except:
        return internal_server_error


def get_kod_predmetu_by_zkratka(session, zkratka_predmetu):
    """ Vrátí kód předmětu podle zkratky předmětu """
    try:
        predmet = session.query(Predmet).filter_by(zkratka_predmetu=zkratka_predmetu).first()
        if predmet:
            return predmet.kod_predmetu
        return None
    except:
        return internal_server_error

def get_kod_predmetu_by_id(session, id_predmetu):
    """ Vrátí kód předmětu podle id """
    try:
        predmet = session.query(Predmet).filter_by(id=id_predmetu).first()
        if predmet:
            return predmet.kod_predmetu
        return None
    except:
        return internal_server_error


def get_vsechny_terminy(session):
    """ Vrátí všechny vypsané termíny """
    try:
        terminy = session.query(Termin).all()
        return [str(termin.id) for termin in terminy]
    except:
        return internal_server_error


def get_vsechny_predmety(session):
    """ Vrátí zkratky předmětů všech různých předmětů """
    try:
        predmety = session.query(Predmet.zkratka_predmetu).all()
        return [predmet.zkratka_predmetu for predmet in predmety]
    except:
        return internal_server_error


def get_vsechny_predmety_kod_katedra(session):
    """ Vrátí zkratky a katedry předmětů všech různých předmětů """
    try:
        predmety = session.query(Predmet).all()
        return [(predmet.zkratka_predmetu, predmet.katedra) for predmet in predmety]
    except:
        return internal_server_error


def subtract_lists(list1, list2):
    """ Odečítání listů (vrátí první list ochuzený o prvky z prvního listu)"""
    result = list(set(list1) - set(list2))
    return result


def get_uznavaci_termin_by_zkratka(session, zkratka_predmetu, kod_predmetu=None):
    """ Vrátí id uznačovacího terminu podle zkratky předmětu """
    try:    
        if kod_predmetu == None:
            kod_predmetu = get_kod_predmetu_by_zkratka(session, zkratka_predmetu)
        termin = session.query(Termin).filter(and_(Termin.kod_predmet==kod_predmetu, Termin.cislo_cviceni==-1)).first()
        if termin is not None:
            return termin.id
        return None
    except:
        return internal_server_error


def get_datum_uznavaci_termin_student(session, id_studenta, id_termin):
    """ Vrátí datum užnávaciho terminu studenta """
    try:
        termin = session.query(HistorieTerminu).filter(and_(HistorieTerminu.termin_id == id_termin, HistorieTerminu.student_id == id_studenta)).first()
        if termin is not None:
            return termin.datum_splneni
        return None
    except:
        return internal_server_error
        

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
        return internal_server_error


def get_datum_splneni_terminu(session, student_id, termin_id):
    try:
        termin_obj = session.query(Termin).filter(Termin.id == termin_id).first()
        kod_predmetu = termin_obj.kod_predmet
        termin = session.query(HistorieTerminu).filter(and_(HistorieTerminu.termin_id == termin_id, HistorieTerminu.student_id == student_id)).first()
        if get_uznani_predmetu_by_student(session, student_id, kod_predmetu):
            termin_id = get_uznavaci_termin_by_zkratka(session, "zkratka", kod_predmetu)
            return get_datum_uznavaci_termin_student(session, student_id, termin_id)
        if termin.datum_splneni:
            return termin.datum_splneni
        else:
            return ""
    except:
        return internal_server_error
    

def pridej_vyucujicimu_predmety_list(session, id_vyucujiciho, list_kodu_predmetu):
    try:
        odeber_vyucujiciho_od_vsech_predmetu(session, id_vyucujiciho)
        for kod_predmetu in list_kodu_predmetu:
            message = pridej_vyucujiciho_na_predmet(session, kod_predmetu, id_vyucujiciho)
            if message != ok:
                return message
    except:
        return internal_server_error
    return ok


def odeber_vyucujiciho_od_vsech_predmetu(session, id_vyucujiciho):
    try:
        session.query(VyucujiciPredmety).filter(VyucujiciPredmety.vyucujici_id == id_vyucujiciho).delete()
        session.commit()
    except:
        session.rollback()
        return internal_server_error
    return ok
        
