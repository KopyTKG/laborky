from conn import *

def get_vyucujiciho_by_predmet(session, kod_predmetu):
    """ Vrátí zahashované id vyučujícího, který vyučuje daný předmět """
    predmet = session.query(Predmet).filter_by(kod_predmetu=kod_predmetu).first()
    if predmet:
        return predmet.vyucuje_id
    

def get_predmet_by_id(session, id_predmetu):
    """ Vrátí kód předmětu podle jeho identifikačního kódů """
    predmet = session.query(Predmet).filter_by(id=id_predmetu).first()
    if predmet:
        return predmet.kod_predmetu


def get_katedra_predmet_by_idterminu(session, id_terminu):
    """ Vrátí zkratku předmětu a zkratku katedry podle id termínu """
    termin = session.query(Termin).filter_by(id=id_terminu).first()
    if termin:
        predmet = termin.predmet
        if predmet:
            return predmet.zkratka_predmetu, predmet.katedra


def get_kod_predmetu_by_zkratka(session, zkratka_predmetu):
    """ Vrátí kód předmětu podle zkratky předmětu """
    predmet = session.query(Predmet).filter_by(zkratka_predmetu=zkratka_predmetu).first()
    if predmet:
        return predmet.kod_predmetu
    else:
        return None
    

def get_vsechny_terminy(session):
    """ Vrátí všechny vypsané termíny """
    terminy = session.query(Termin).all()
    return [termin.id for termin in terminy]


def get_vsechny_predmety(session):
    """ Vrátí zkratky předmětů všech různých předmětů """
    predmety = session.query(Predmet.zkratka_predmetu).all()
    return [predmet.zkratka_predmetu for predmet in predmety]