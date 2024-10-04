from sqlalchemy import create_engine, MetaData, Table, ForeignKey, Column, String, Integer, Text, UUID, DateTime, distinct, func, and_
from sqlalchemy.orm import sessionmaker, relationship, declarative_base
import os, dotenv
import uuid
from datetime import datetime, timedelta
from sqlalchemy.exc import SQLAlchemyError
from lib.HTTP_messages import *


# nacteni DB connection stringu z .env
dotenv.load_dotenv()
DATABASE_URL = os.getenv('DB_URL')

interval_vypisu_terminu = int(os.getenv('INTERVAL_VYPISU_DNY'))

# navazani pripojeni k DB
engine = create_engine(DATABASE_URL)

Base = declarative_base()

Session = sessionmaker(bind=engine)

# connector/handler pro databazi
session = Session()


# Jednotlive namapovane tables

class Termin(Base):
    __tablename__ = "termin"

    id = Column("id", UUID, primary_key=True)
    ucebna = Column("ucebna", Text)
    datum_start = Column("datum_start", DateTime)
    datum_konec = Column("datum_konec", DateTime)

    aktualni_kapacita = Column("aktualni_kapacita", Integer)
    max_kapacita = Column("max_kapacita", Integer)
    jmeno = Column("jmeno", Text)
    vypsal_id = Column(String, ForeignKey('vyucujici.id'))
    vyucuje_id = Column(String, ForeignKey('vyucujici.id'))
    kod_predmet = Column(Text, ForeignKey('predmet.kod_predmetu'))
    cislo_cviceni = Column("cislo_cviceni", Integer)
    popis = Column("popis", Text)

    predmet = relationship('Predmet', back_populates="termin")
    vypsal = relationship('Vyucujici', foreign_keys=[vypsal_id], back_populates="terminy_vypsal")
    vyucuje = relationship('Vyucujici', foreign_keys=[vyucuje_id], back_populates="terminy_vyucuje")
    historie_terminu = relationship('HistorieTerminu', back_populates="termin")




class Vyucujici(Base):
    __tablename__ = "vyucujici"

    id = Column("id", String, primary_key=True)

    terminy_vyucuje = relationship("Termin", foreign_keys=[Termin.vyucuje_id], back_populates="vyucuje")
    terminy_vypsal = relationship("Termin", foreign_keys=[Termin.vypsal_id], back_populates="vypsal")
    predmet = relationship("Predmet", back_populates="vyucuje")


class Predmet(Base):
    __tablename__ = "predmet"

    kod_predmetu = Column("kod_predmetu", Text, primary_key=True)
    zkratka_predmetu = Column("zkratka_predmetu", Text)
    katedra = Column("katedra", Text)
    vyucuje_id = Column("vyucujici_id", String, ForeignKey('vyucujici.id'))
    pocet_cviceni = Column("pocet_cviceni", Integer)

    vyucuje = relationship('Vyucujici', back_populates="predmet")
    termin = relationship('Termin', back_populates="predmet")
    zapsane_predmety = relationship('ZapsanePredmety', back_populates="predmet")


class Student(Base):
    __tablename__ = "student"

    id = Column("id", String, primary_key=True)
    datum_vytvoreni = Column("datum_vytvoreni", DateTime)

    zapsane_predmety = relationship('ZapsanePredmety', back_populates="student")
    historie_terminu = relationship('HistorieTerminu', back_populates="student")


class ZapsanePredmety(Base):
    __tablename__ = "zapsane_predmety"

    id = Column("id", UUID, primary_key=True)
    zapsano = Column("zapsano", DateTime)
    student_id = Column(String, ForeignKey('student.id'))
    kod_predmet = Column(Text, ForeignKey('predmet.kod_predmetu'))

    student = relationship('Student', back_populates="zapsane_predmety")
    predmet = relationship('Predmet', back_populates="zapsane_predmety")


class HistorieTerminu(Base):
    __tablename__ = "historie_terminu"

    id = Column("id", UUID, primary_key=True)
    student_id = Column(String, ForeignKey('student.id'))
    termin_id = Column(UUID, ForeignKey('termin.id'))
    datum_splneni = Column("datum_splneni", DateTime)

    student = relationship('Student', back_populates="historie_terminu")
    termin = relationship('Termin', back_populates="historie_terminu")



### TVORBA UZIVATEL
def vytvor_student(session, id):
    try:
        if session.query(Student).filter_by(id=id).first() is None:
            student = Student(id=id, datum_vytvoreni=datetime.now())
            session.add(student)
            session.commit()
            return ok
        return ok
    except:
        session.rollback()
        return internal_server_error


def vytvor_vyucujici(session, id):
    try:
        if session.query(Vyucujici).filter_by(id=id).first() is None:
            vyucujici = Vyucujici(id=id)
            session.add(vyucujici)
            session.commit()
            return ok
        return ok
    except:
        session.rollback()
        return internal_server_error


### USER ACTIONS
def upravit_termin(session, id_terminu, newStartDatum=None, newKonecDatum=None, newUcebna=None, newMax_kapacita=None, newJmeno=None, cislo_cviceni=None, newPopis=None):
    try:
        termin = session.query(Termin).filter(Termin.id == id_terminu).first()

        if termin is None:
            return not_found

        if newStartDatum is not None:
            termin.datum_start = newStartDatum

        if newKonecDatum is not None:
            termin.datum_konec = newKonecDatum

        if newUcebna is not None:
            termin.ucebna = newUcebna

        if newMax_kapacita is not None:
            termin.max_kapacita = newMax_kapacita

        if newJmeno is not None:
            termin.jmeno = newJmeno

        if cislo_cviceni is not None:
            termin.cislo_cviceni = cislo_cviceni

        if newPopis is not None:
            termin.popis = newPopis

        session.commit()
        return ok
    except:
        session.rollback()
        return internal_server_error


def odepsat_z_terminu(session, student_id, termin_id):
    try:
        termin = session.query(HistorieTerminu).filter(HistorieTerminu.termin_id == termin_id,HistorieTerminu.student_id == student_id).first()

        if termin:
            if termin.datum_splneni is not None:
                return unauthorized

            konkretni_termin = session.query(Termin).filter(Termin.id == termin_id).first()

            if (konkretni_termin.datum_start - datetime.now()) < timedelta(hours=24):
                return conflict

            konkretni_termin.aktualni_kapacita -= 1

            session.delete(termin)
            session.commit()
            return ok
        else:
            return bad_request

    except:
        session.rollback()
        return internal_server_error


def zapsat_se_na_termin(session, student_id, termin_id):
    try:
        zapsat_na_termin = HistorieTerminu(id=uuid.uuid4(), student_id=student_id, termin_id=termin_id)

        termin = session.query(Termin).filter(Termin.id == termin_id).first()

        if termin is None:
            return not_found

        if termin.aktualni_kapacita >= termin.max_kapacita:
            return conflict

        if termin.cislo_cviceni == -1:
            return conflict

        termin.aktualni_kapacita += 1
        session.add(zapsat_na_termin)
        session.commit()

        return ok

    except:
        session.rollback()
        return internal_server_error


def smazat_termin(session, id_terminu):
    try:
        termin = session.query(HistorieTerminu).filter(HistorieTerminu.termin_id == id_terminu).first()

        if termin is None:
            print(f"Termin s ID {id_terminu} neexistuje. Nebo na termin nejste prihlasen.")
            return 404

        session.delete(termin)
        session.commit()
        return ok

    except:
        session.rollback()
        return internal_server_error


def uznat_termin(session, id_terminu, id_studenta, zvolene_datum_splneni=None):
    try:
        termin = session.query(HistorieTerminu).filter(and_(HistorieTerminu.termin_id == id_terminu,HistorieTerminu.student_id == id_studenta)).first()

        if termin is None:
            return not_found

        if zvolene_datum_splneni is not None:
            termin.datum_splneni = zvolene_datum_splneni

        else:
            termin.datum_splneni = datetime.now()

        session.commit()
        return ok

    except:
        session.rollback()
        return internal_server_error


def pridat_studenta(session, student_id, termin_id, datum_splneni=None):
    try:
        if session.query(Student).filter_by(id=student_id).first() is None:
            return not_found

        elif session.query(HistorieTerminu).filter(and_(HistorieTerminu.termin_id == termin_id,HistorieTerminu.student_id == student_id)).first() is not None:
            return conflict

        zapis_termin = HistorieTerminu(id=uuid.uuid4(),student_id=student_id,termin_id=termin_id,datum_splneni=datum_splneni)

        session.add(zapis_termin)

        termin = session.query(Termin).filter(Termin.id == termin_id).first()
        termin.aktualni_kapacita += 1

        session.commit()
        return ok

    except:
        session.rollback()
        return internal_server_error

### PREDMETY
def vytvor_predmet(session, kod_predmetu, zkratka_predmetu, katedra, vyucuje_id, pocet_cviceni):
    try:
        if session.query(Predmet).filter_by(kod_predmetu=kod_predmetu).first() is not None:
            return conflict

        predmet = Predmet(kod_predmetu=kod_predmetu,zkratka_predmetu=zkratka_predmetu,katedra=katedra,vyucuje_id=vyucuje_id,pocet_cviceni=pocet_cviceni)

        session.add(predmet)

        session.commit()
        return ok
    except:
        session.rollback()
        return internal_server_error

### TERMINY
def vypsat_termin(session, ucebna: Text, datum_start: datetime, datum_konec: datetime, max_kapacita: int, vypsal_id: Text, vyucuje_id: Text, kod_predmet: Text, jmeno: Text, cislo_cviceni: int,popis: Text, aktualni_kapacita=0):
    try:
        vyucujici = session.query(Vyucujici).filter_by(id=vyucuje_id).first()
        if vyucujici is None:
            return not_found

        termin = Termin(id=uuid.uuid4(),ucebna=ucebna,datum_start=datum_start,datum_konec=datum_konec,aktualni_kapacita=aktualni_kapacita,max_kapacita=max_kapacita,vypsal_id=vypsal_id,vyucuje_id=vyucuje_id,kod_predmet=kod_predmet,jmeno=jmeno,cislo_cviceni=cislo_cviceni, popis=popis)

        session.add(termin)

        session.commit()
        return ok

    except Exception as e:
        session.rollback()
        return e


def historie_studenta(session, id):
    try:
        student = session.query(Student).filter_by(id=id).first()

        if student is None:
            return not_found

        termins = []
        for history in student.historie_terminu:
            termin = history.termin
            termins.append(termin)

        return termins

    except:
        return internal_server_error


def uspesne_zakonceni_studenta_terminy(session, id_studenta, kod_predmetu):
    """ Vrátí všechny úspěsné zakončené termíny (HistorieTerminu) v předmětu """
    try:
        uspesne_terminy = session.query(HistorieTerminu).join(Termin, HistorieTerminu.termin_id == Termin.id).filter(and_(HistorieTerminu.student_id == id_studenta,Termin.kod_predmet == kod_predmetu,HistorieTerminu.datum_splneni != None)).all()
        uspesne_terminy_list = [student for student in uspesne_terminy]
        return uspesne_terminy_list

    except:
        return False


def uspesne_dokoncene_terminy(session, id):
    try:
        student = session.query(Student).filter_by(id=id).first()

        if student is None:
            return not_found

        splnene_terminy = []
        for history in student.historie_terminu:
            termin = history.termin  

            if history.datum_splneni is not None:
                splnene_terminy.append(termin)

        return splnene_terminy

    except:
        return internal_server_error

def pocet_cviceni_pro_predmet(session):
    try:
        predmety = session.query(distinct(Predmet.kod_predmetu)).all()
        predmet_pocet_cviceni = {}

        if not predmety:
            return {}

        for predmet in predmety:
            nazev = predmet[0]
            predmet_obj = session.query(Predmet).filter_by(kod_predmetu=nazev).first()

            if predmet_obj:
                pocet_cviceni = predmet_obj.pocet_cviceni
                if pocet_cviceni:
                    predmet_pocet_cviceni[nazev] = [0] * pocet_cviceni
                else:
                    predmet_pocet_cviceni[nazev] = []

        return predmet_pocet_cviceni

    except:
        return internal_server_error


# zde nesmi prichazet parametr katedra - musi si to brat z "Uspesne zakonceni studenta"
def vyhodnoceni_studenta(session, id_studenta, pocet_pro_predmet):
    for kod_predmetu in list(pocet_pro_predmet.keys()):
        uspesne_terminy = uspesne_zakonceni_studenta_terminy(session, id_studenta, kod_predmetu)

        if uspesne_terminy:
            for historie_terminu in uspesne_terminy:
                termin = session.query(Termin).filter(Termin.id == historie_terminu.termin_id).first()
                if termin:
                    if termin.cislo_cviceni == -1:
                        for i in range(len(pocet_pro_predmet[kod_predmetu])):
                            pocet_pro_predmet[kod_predmetu][i] = historie_terminu.datum_splneni
                    else:
                        cislo_cviceni = termin.cislo_cviceni - 1
                        pocet_pro_predmet[kod_predmetu][cislo_cviceni] = historie_terminu.datum_splneni

    return pocet_pro_predmet


def vypis_uspesnych_studentu(session, zkratka_predmetu):
    kod_predmetu = session.query(Predmet).filter_by(zkratka_predmetu=zkratka_predmetu).first().kod_predmetu
    if kod_predmetu is None:
        return not_found

    studenti = (
        session.query(Student)
        .join(HistorieTerminu, HistorieTerminu.student_id == Student.id)  # Join HistorieTerminu with Student
        .join(Termin, HistorieTerminu.termin_id == Termin.id)             # Join HistorieTerminu with Termin
        .filter(Termin.kod_predmet == kod_predmetu)                       # Filter by the given kod_predmetu
        .all()  # Return all matching students
    )

    pocet_pro_predmet = {kod_predmetu: pocet_cviceni_pro_predmet(session)[kod_predmetu]}

    vyhodnoceni_studentu = {}
    for student in studenti:
        if get_uznani_predmetu_by_student(session, student.id, kod_predmetu):
            vyhodnoceni_studentu[student.id] = 1
        else:
            vyhodnoceni = vyhodnoceni_studenta(session, student.id, pocet_pro_predmet)
            if 0 in vyhodnoceni[kod_predmetu]:
                continue
            else:
                vyhodnoceni_studentu[student.id] = vyhodnoceni

    return vyhodnoceni_studentu

def get_uznani_predmetu_by_student(session, id_studenta, kod_predmetu):
    """ Vrátí, zda má student předmět celý uznán """
    result = (
        session.query(Termin)
        .join(HistorieTerminu, HistorieTerminu.termin_id == Termin.id)
        .join(Student, Student.id == HistorieTerminu.student_id)
        .filter(
            Termin.cislo_cviceni == -1,    # Check if it's the specific exercise (-1)
            Student.id == id_studenta,     # Match the student ID
            Termin.kod_predmet == kod_predmetu  # Match the subject code
        )
        .first()  # Use first() to return one result or None
    )

    return result is not None 


if __name__ == "__main__":

    print(get_uznani_predmetu_by_student(session, "72d93dcb44c56fc46f98921ee8e8299eeb112443", "KFEOBP"))
    # historie_studenta(session,'0d162f64-61dd-446d-a3e2-404a994e9a9f')
    # list_probehle_terminy(session)
    # list_probehle_terminy_predmet(session, 'CS101')
    # list_terminy_vyucujici(session,'10ade7bd-a3c1-4c8d-baa6-478cb6cd7e63')
    # vypsat_termin(session, uuid.uuid4(), 'CSC 101', datetime.now(), 0, 20, '10ade7bd-a3c1-4c8d-baa6-478cb6cd7e63', '10ade7bd-a3c1-4c8d-baa6-478cb6cd7e63', 'CS101', 'Object oriented programming principles')
    # upravit_termin(session, '6882d71a-42ab-4fb8-8134-87a72982dd42', newUcebna='6.13')
    # list_terminy_vyucujici(session, '6a08d4c9-c9ee-4cd9-9464-7b8033b50a8a')
    # list_probehle_terminy_predmet(session, 'CS101')

    # historickeTerminy = (historie_studenta(session, '0d162f64-61dd-446d-a3e2-404a994e9a9f'))
    # for history in historickeTerminy:
    #     termin = history.termin
    #     print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Date: {termin.datum}, Room: {termin.ucebna}")\

    # terminy = list_dostupnych_terminu(session, ['CS101','CS102'])

    # lide = list_studenti_z_terminu(session, 'f431944a-eb16-402f-81ee-47d72699d947')
    # for clovek in lide:
        # print(f"id: {clovek}")
    # for termin in terminy:
    #     print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Date: {termin.datum}, Room: {termin.ucebna}")

    # terminy = list_terminy(session)
    # for termin in terminy:
    #     print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Date: {termin.datum}, Room: {termin.ucebna}")


    #vypis = vypis_uspesnych_studentu(session, "MATH202")
    #print(vypis)

    #vypis = vypis_uspesnych_studentu(session, "CS101")
    #print(vypis)

    #vypis = list(vypis.keys())
    #print(vypis)
    #print(get_katedra_predmet_by_idterminu(session, "f431944a-eb16-402f-81ee-47d72699d947"))

    #pocet_cviceni_pro_p = pocet_cviceni_pro_predmet(session)
    #print(pocet_cviceni_pro_p)

    #vyhodnoceni = vyhodnoceni_studenta(session, "4a71df77a1acbbe459be5cca49038fece4f49a6f", pocet_cviceni_pro_p)
    #print(list(vyhodnoceni.keys()))


    #vypis_uspesnych = vypis_uspesnych_studentu(session, 'MPS1')
    #print(vypis_uspesnych)

    #print(vypis_vsechny_predmety(session))
    #print(vyhodnoceni)
    #print(list_dostupnych_terminu(session, ['KMPMPS1', 'KPPPO2R'], vyhodnoceni, "4a71df77a1acbbe459be5cca49038fece4f49a6f"))
    #print(historie_studenta(session, "4a71df77a1acbbe459be5cca49038fece4f49a6f"))

    #print(vypis_vsechny_predmety(session))
    #probehle = list_probehle_terminy_predmet(session, 'MATH202')
    #planovane = list_planovane_terminy_predmet(session, 'MATH202')

    #print(probehle + planovane)

    #historie = historie_studenta(session, "4a71df77a1acbbe459be5cca49038fece4f49a6f")
    #splnene_terminy = uspesne_dokoncene_terminy(session, "4a71df77a1acbbe459be5cca49038fece4f49a6f")

    #print(subtract_lists(historie, splnene_terminy))
    #print(list_dostupnych_terminu(session, ["KMPMPS1", "KPPPO2R"], vyhodnoceni, "4a71df77a1acbbe459be5cca49038fece4f49a6f"))

    pass


