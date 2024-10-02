from sqlalchemy import create_engine, MetaData, Table, ForeignKey, Column, String, Integer, Text, UUID, DateTime, distinct, func, and_
from sqlalchemy.orm import sessionmaker, relationship, declarative_base
import os, dotenv
import uuid
from datetime import datetime, timedelta


# nacteni DB connection stringu z .env
dotenv.load_dotenv()
DATABASE_URL = os.getenv('DB_URL')

interval_vypisu_terminu = os.getenv('INTERVAL_VYPISU_DNY')

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
    datum = Column("datum", DateTime)
    aktualni_kapacita = Column("aktualni_kapacita", Integer)
    max_kapacita = Column("max_kapacita", Integer)
    jmeno = Column("jmeno", Text)
    vypsal_id = Column(String, ForeignKey('vyucujici.id'))
    vyucuje_id = Column(String, ForeignKey('vyucujici.id'))
    kod_predmet = Column(Text, ForeignKey('predmet.kod_predmetu'))
    cislo_cviceni = Column("cislo_cviceni", Integer)

    predmet = relationship('Predmet', back_populates="termin")
    vypsal = relationship('Vyucujici', foreign_keys=[vypsal_id], back_populates="terminy_vypsal")
    vyucuje = relationship('Vyucujici', foreign_keys=[vyucuje_id], back_populates="terminy_vyucuje")
    historie_terminu = relationship('HistorieTerminu', back_populates="termin")




class Vyucujici(Base):
    __tablename__ = "vyucujici"

    id = Column("id", String, primary_key=True)
    prijmeni = Column("prijmeni", Text)

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
    if session.query(Student).filter_by(id=id).first() is None:
        student = Student(id=id, datum_vytvoreni=datetime.now())
        session.add(student)
        session.commit()
        return True
    return False
def pridej_vyucujici(session, id, prijmeni):
    if session.query(Vyucujici).filter_by(id=id).first() is None:
        vyucujici = Vyucujici(id=id, prijmeni=prijmeni)
        session.add(vyucujici)
        session.commit()
        return True
    return False
### USER ACTIONS
def zapis_predmet(session, kod_predmetu, student_id):
    zapsane_predmety = ZapsanePredmety(uuid=uuid.uuid4(),zapsano=datetime.now(), student_id=student_id, kod_predmet=kod_predmetu)
    session.add(zapsane_predmety)
    session.commit()
    return True

def upravit_termin(session, id_terminu, newDatum=None, newUcebna=None, newMax_kapacita=None, newVyucuje_id=None, newJmeno=None, cislo_cviceni=None):
    termin = session.query(Termin).filter(Termin.id == id_terminu).first()
    if termin is None:
        print(f"Termin s ID {id_terminu} neexistuje.")
        return False

    if newDatum is not None:
        termin.datum = newDatum

    if newUcebna is not None:
        termin.ucebna = newUcebna

    if newMax_kapacita is not None:
        termin.max_kapacita = newMax_kapacita

    if newVyucuje_id is not None:
        termin.vyucuje_id = newVyucuje_id

    if newJmeno is not None:
        termin.jmeno = newJmeno

    if cislo_cviceni is not None:
        termin.cislo_cviceni = cislo_cviceni

    session.commit()
    return True

def odepsat_z_terminu(session, student_id, termin_id):
    termin = session.query(HistorieTerminu).filter(HistorieTerminu.termin_id == termin_id, HistorieTerminu.student_id == student_id).first()
    if termin:
        if termin.datum_splneni is not None:
            print(f"Termin s ID {termin_id} je splnen.")
            return 1
        konkretni_termin = session.query(Termin).filter(Termin.id == termin_id).first()
        if (konkretni_termin.start_time - datetime.now()) < timedelta(hours=24):
            return 2
        konkretni_termin.aktualni_kapacita -= 1

        session.delete(termin)
        session.commit()
        return 0
    else:
        print(f"Termin s ID {termin_id} neexistuje. Nebo na termin nejste prihlasen.")
        return 3

def zapsat_se_na_termin(session, student_id, termin_id):
    zapsat_na_termin = HistorieTerminu(id = uuid.uuid4(),student_id = student_id,termin_id = termin_id)
    termin = session.query(Termin).filter(Termin.id == termin_id).first()
    if termin.aktualni_kapacita >= termin.max_kapacita:
        print(f"Termin s ID {termin_id} je plny. Nebo na termin nejste prihlasen.")
        return False
    else:
        termin.aktualni_kapacita += 1
        session.add(zapsat_na_termin)
        session.commit()
        return True


# Nepoužíváme
"""
def list_uspesni_studenti(session, kod_predmetu):
    kvota_cviceni = session.query(Predmet.pocet_cviceni).filter(Predmet.kod_predmetu == kod_predmetu).first()
    uspesni_studenti = session.query(HistorieTerminu).filter(HistorieTerminu.datum_splneni != None ).group_by(HistorieTerminu.student_id).having(func.count(HistorieTerminu.id) > kvota_cviceni[0]).all()
    uspesni_studenti_list = [student[0] for student in uspesni_studenti]
    return uspesni_studenti_list
"""


def uspesne_zakonceni_studenta(session, id_studenta, kod_predmetu):

    uspesni_studenti = session.query(HistorieTerminu).join(Termin, HistorieTerminu.termin_id == Termin.id).filter(and_(HistorieTerminu.student_id == id_studenta, Termin.kod_predmet == kod_predmetu, HistorieTerminu.datum_splneni != None)).all()
    uspesni_studenti_list = [student for student in uspesni_studenti]
    return uspesni_studenti_list

def smazat_termin(session, id_terminu):
    if session.query(HistorieTerminu).filter(HistorieTerminu.termin_id == id_terminu).first() is None:
        print(f"Termin s ID {id_terminu} neexistuje. Nebo na termin nejste prihlasen.")
        return False
    termin = session.query(HistorieTerminu).filter(HistorieTerminu.termin_id == id_terminu).first()
    session.delete(termin)
    session.commit()
    return True

def uznat_termin(session, id_terminu, id_studenta, zvolene_datum_splneni=None):
    termin = session.query(HistorieTerminu).filter(and_(HistorieTerminu.termin_id == id_terminu, HistorieTerminu.student_id == id_studenta)).first()
    if zvolene_datum_splneni is not None:
        termin.datum_splneni = zvolene_datum_splneni
    else:
        termin.datum_splneni = datetime.now()
    session.commit()
    return True

def pridat_studenta(session, student_id, termin_id, datum_splneni=None):
    if session.query(Student).filter_by(id=student_id).first() is None:
        return 1
    elif session.query(HistorieTerminu).filter(and_(HistorieTerminu.termin_id == termin_id, HistorieTerminu.student_id == student_id)).first() is not None:
        return 2
    zapis_termin = HistorieTerminu(id=uuid.uuid4(),student_id=student_id,termin_id=termin_id,datum_splneni=datum_splneni)
    session.add(zapis_termin)
    termin = session.query(Termin).filter(Termin.id == termin_id).first()
    termin.aktualni_kapacita += 1
    session.commit()
    return 0

### PREDMETY
def vytvor_predmet(session,kod_predmetu,zkratka_predmetu,katedra,vyucuje_id, pocet_cviceni):
    if session.query(Predmet).filter_by(kod_predmetu=kod_predmetu).first() is not None:
        return False
    predmet=Predmet(kod_predmetu=kod_predmetu,zkratka_predmetu=zkratka_predmetu,katedra=katedra,vyucuje_id=vyucuje_id, pocet_cviceni=pocet_cviceni)
    session.add(predmet)
    session.commit()
    return True
def list_predmety(session):
    predmety = session.query(Predmet).all()
    for predmet in predmety:
        print(f"Kod: {predmet.kod_predmetu}, Zkratka: {predmet.zkratka_predmetu}, Katedra: {predmet.katedra}, Vyucujici: {predmet.vyucuje.prijmeni}")
    predmet_list = [predmet for predmet in predmety]
    return predmet_list

def list_dostupnych_terminu(session, predmety, historie_predmetu, id_studenta):
    current_date = datetime.now()

    # Step 1: Query all available terms for the specified subjects (predmety)
    terminy = session.query(Termin).filter(
        and_(
            Termin.kod_predmet.in_(predmety),  # Only terms from the specified subjects
            Termin.datum > current_date - timedelta(hours=1),  # Terms that have not passed yet and the ones that barely started (1 hour ago eg.)
        )
    ).order_by(Termin.datum.desc()).all()

    # Step 2: Filter out terms that the student has already completed or attended
    terminy_list = []

    for termin in terminy:
        kod_predmetu = termin.kod_predmet
        cislo_cviceni = termin.cislo_cviceni

        # Check if the term corresponds to a subject the student has history for
        if kod_predmetu in historie_predmetu:
            # If the exercise (cislo_cviceni) has been completed (1 in the list), skip this term
            if historie_predmetu[kod_predmetu][cislo_cviceni - 1] == 1:
                print(cislo_cviceni)
                print("SPLNENE CVICENI")
                continue  # Skip this term since the student already completed it

        # Step 3: Check if the student has already attended the term (in HistorieTerminu)
        attended = session.query(HistorieTerminu).filter(
            and_(
                HistorieTerminu.student_id == id_studenta,
                HistorieTerminu.termin_id == termin.id
            )
        ).first()

        if attended is None:
            # The student has not attended this term, so it's available
            terminy_list.append(termin)

    return terminy_list


### TERMINY
def list_terminy(session):
    terminy = session.query(Termin).order_by(Termin.datum.desc())
    # for termin in terminy:
    #     print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Date: {termin.datum}, Room: {termin.ucebna}, Vyucujici: {termin.vyucuje.prijmeni}, Vypsal: {termin.vypsal.prijmeni}, Aktualni kapacita: {termin.aktualni_kapacita}, Max kapacita: {termin.max_kapacita}")
    termin_list = [termin for termin in terminy]
    return termin_list

def list_studenti_z_terminu(session, termin_id):
    student_list = session.query(HistorieTerminu).filter(HistorieTerminu.termin_id == termin_id).all()
    studenti_list = [student.student_id for student in student_list]
    return studenti_list

def vypsat_termin(session, ucebna:Text, datum:datetime, max_kapacita:int, vypsal_id:Text, vyucuje_id:Text, kod_predmet:Text, jmeno:Text, cislo_cviceni:int,  aktualni_kapacita=0):
    vyucujici = session.query(Vyucujici).filter_by(id=vyucuje_id).first()
    if vyucujici is None:
        print("Neplatne ID vyucujiciho! Zda se ze vyucujici neni zaregistrovan")
        return False
    termin = Termin(id=uuid.uuid4(), ucebna=ucebna, datum=datum, aktualni_kapacita=aktualni_kapacita, max_kapacita=max_kapacita, vypsal_id=vypsal_id, vyucuje_id=vyucuje_id, kod_predmet=kod_predmet, jmeno=jmeno, cislo_cviceni=cislo_cviceni)
    session.add(termin)
    session.commit()
    return True

def list_nadchazejici_terminy(session):
    dnesni_datum = datetime.now()
    terminy = session.query(Termin).filter(Termin.datum >= dnesni_datum).order_by(Termin.datum.asc())
    for termin in terminy:
        print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Date: {termin.datum}, Room: {termin.ucebna}")
    terminy_list = [termin for termin in terminy]
    return terminy_list

def list_probehle_terminy(session):
    dnesni_datum = datetime.now()
    terminy = session.query(Termin).filter(Termin.datum <= dnesni_datum).order_by(Termin.datum.desc())
    for termin in terminy:
        print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Date: {termin.datum}, Room: {termin.ucebna}")
    terminy_list = [termin for termin in terminy]
    return terminy_list

def list_planovane_terminy_predmet(session, kod_predmetu):
    dnesni_datum = datetime.now()
    terminy = session.query(Termin).filter(and_(Termin.kod_predmet == kod_predmetu, Termin.datum >= dnesni_datum)).order_by(Termin.datum.asc())
    for termin in terminy:
        print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Vyucujici: {termin.vyucuje.prijmeni}, Vypsal: {termin.vypsal.prijmeni}, Date: {termin.datum}, Room: {termin.ucebna}")
    terminy_list = [termin for termin in terminy]
    return terminy_list

def list_probehle_terminy_predmet(session, kod_predmetu):
    dnesni_datum = datetime.now()
    terminy = session.query(Termin).filter(and_(Termin.kod_predmet == kod_predmetu, Termin.datum <= dnesni_datum)).order_by(Termin.datum.desc())
    for termin in terminy:
        print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Vyucujici: {termin.vyucuje.prijmeni}, Vypsal: {termin.vypsal.prijmeni}, Date: {termin.datum}, Room: {termin.ucebna}")
    terminy_list = [termin for termin in terminy]
    return terminy_list

def list_terminy_vyucujici(session, id):
    terminy = session.query(Termin).filter(Termin.vyucuje_id == id).order_by(Termin.datum.desc())
    if terminy is None:
        print("Vyucujici nema naplanovane zadne terminy, nebo jeho ID neexistuje!")
        return False
    for termin in terminy:
        print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Date: {termin.datum}, Room: {termin.ucebna}")
    terminy_list = [termin for termin in terminy]
    return terminy_list

def historie_studenta(session, id):
    student = session.query(Student).filter_by(id=id).first()
    if student is None:
        print("Neplatne ID studenta!")
        return False
    for history in student.historie_terminu:
        termin = history.termin
        print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Date: {termin.datum}, Room: {termin.ucebna}")
    terminy_list = [termin for termin in student.historie_terminu]
    return terminy_list

def terminy_dopredu(session):
    start_date = datetime.now()
    end_date = start_date + timedelta(days=interval_vypisu_terminu)
    terminy = session.query(Termin).filter(and_(Termin.datum >= start_date, Termin.datum <= end_date)).order_by(Termin.datum.asc())
    terminy_list = [termin for termin in terminy]
    return terminy_list


def terminy_dopredu_pro_vyucujiho(session, id):
    start_date = datetime.now()
    end_date = start_date + timedelta(days=interval_vypisu_terminu)
    terminy = session.query(Termin).filter(and_(Termin.datum >= start_date, Termin.datum <= end_date, Termin.vyucuje_id == id)).order_by(Termin.datum.asc())
    terminy_list = [termin for termin in terminy]
    return terminy_list

def pocet_cviceni_pro_predmet(session):
    predmety = session.query(distinct(Predmet.kod_predmetu)).all()
    predmet_pocet_cviceni = {}

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


# zde nesmi prichazet parametr katedra - musi si to brat z "Uspesne zakonceni studenta"
def vyhodnoceni_studenta(session, id_studenta, pocet_pro_predmet):
    for kod_predmetu in list(pocet_pro_predmet.keys()):
        uspesne_terminy = uspesne_zakonceni_studenta(session, id_studenta, kod_predmetu)

        if uspesne_terminy:
            for termin in uspesne_terminy:
                cisla_cviceni = session.query(Termin.cislo_cviceni)\
                       .join(HistorieTerminu, HistorieTerminu.termin_id == Termin.id)\
                       .filter(HistorieTerminu.student_id == id_studenta, Termin.kod_predmet == kod_predmetu)\
                       .all()
                if cisla_cviceni:
                    for cislo in cisla_cviceni:
                        cislo = cislo[0] - 1
                        pocet_pro_predmet[kod_predmetu][cislo] = 1

    return pocet_pro_predmet


def vypis_uspesnych_studentu(session, zkratka_predmetu):

    studenti = ( # se vztahem k urcitemu predmetu
        session.query(Student)
        .join(ZapsanePredmety)
        .join(Predmet)
        .filter(Predmet.zkratka_predmetu == zkratka_predmetu)
        .all()
    )

    kod_predmetu = session.query(Predmet).filter_by(zkratka_predmetu=zkratka_predmetu).first().kod_predmetu

    pocet_pro_predmet = {kod_predmetu: pocet_cviceni_pro_predmet(session)[kod_predmetu]}

    vyhodnoceni_studentu = {}

    for student in studenti:
        vyhodnoceni = vyhodnoceni_studenta(session, student.id, pocet_pro_predmet)
        if 0 in vyhodnoceni[kod_predmetu]:
            continue
        else:
            vyhodnoceni_studentu[student.id] = vyhodnoceni

    return vyhodnoceni_studentu

def vypis_vsechny_predmety(session):
    """ Vrátí zkratky předmětů všech různých předmětů """
    predmety = session.query(Predmet.zkratka_predmetu).all()
    return [predmet.zkratka_predmetu for predmet in predmety]


def vypis_vsechny_terminy(session):
    """ Vrátí všechny vypsané termíny """
    terminy = session.query(Termin).all()
    return [termin.id for termin in terminy]


def get_kod_predmetu_by_zkratka(session, zkratka_predmetu):
    predmet = session.query(Predmet).filter_by(zkratka_predmetu=zkratka_predmetu).first()
    if predmet:
        return predmet.kod_predmetu
    else:
        return None


def get_katedra_predmet_by_idterminu(session, id_terminu):
    termin = session.query(Termin).filter_by(id=id_terminu).first()
    if termin:
        predmet = termin.predmet
        if predmet:
            return predmet.zkratka_predmetu, predmet.katedra


if __name__ == "__main__":
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
    #print(vyhodnoceni)

    #vypis_uspesnych = vypis_uspesnych_studentu(session, 'MPS1')
    #print(vypis_uspesnych)

    #print(vypis_vsechny_predmety(session))
    #print(vyhodnoceni)
    #print(list_dostupnych_terminu(session, ['KMPMPS1', 'KPPPO2R'], vyhodnoceni, "4a71df77a1acbbe459be5cca49038fece4f49a6f"))
    #print(historie_studenta(session, "4a71df77a1acbbe459be5cca49038fece4f49a6f"))

    print(vypis_vsechny_predmety(session))
    probehle = list_probehle_terminy_predmet(session, 'MATH202')
    planovane = list_planovane_terminy_predmet(session, 'MATH202')

    print(probehle + planovane)

    pass


