from sqlalchemy import create_engine, MetaData, Table, ForeignKey, Column, String, Integer, Text, UUID, DateTime
from sqlalchemy.orm import sessionmaker, relationship, declarative_base
import os, dotenv
import uuid
from datetime import datetime

# nacteni DB connection stringu z .env
dotenv.load_dotenv()
DATABASE_URL = os.getenv('DB_URL')

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
        student = Student(id=id, datum_vytvoreni=DateTime.now())
        session.add(student)
        session.commit()
        return True
    else:
        pass
def pridej_vyucujici(session, id, prijmeni):
    if session.query(Vyucujici).filter_by(id=id).first() is None:
        vyucujici = Vyucujici(id=id, prijmeni=prijmeni)
        session.add(vyucujici)
        session.commit()
        return True
    else:
        pass
### USER ACTIONS
def zapis_predmet(session, kod_predmetu, student_id):
    zapsane_predmety = ZapsanePredmety(uuid=uuid.uuid4(),zapsano=datetime.now(), student_id=student_id, kod_predmet=kod_predmetu)
    session.add(zapsane_predmety)
    session.commit()
    return True

def upravit_termin(session, id_terminu, newDatum=None, newUcebna=None, newMax_kapacita=None, newVyucuje_id=None, newJmeno=None):
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
    session.commit()
    return True

def odepsat_z_terminu(session, student_id, termin_id):
    termin = session.query(HistorieTerminu).filter(HistorieTerminu.termin_id == termin_id, HistorieTerminu.student_id == student_id).first()
    if termin:
        session.delete(termin)
        konkretni_termin = session.query(Termin).filter(Termin.id == termin_id).first()
        konkretni_termin.aktualni_kapacita -= 1
        session.commit()
        return True
    else:
        print(f"Termin s ID {termin_id} neexistuje. Nebo na termin nejste prihlasen.")
        return False

def zapsat_se_na_termin(session, student_id, termin_id):
    session.query(HistorieTerminu).add(uuid.uuid4(),student_id, termin_id)
    termin = session.query(Termin).filter(Termin.id == termin_id).first()
    if termin.aktualni_kapacita >= termin.max_kapacita:
        print(f"Termin s ID {termin_id} je plny. Nebo na termin nejste prihlasen.")
        return False
    else:
        termin.aktualni_kapacita += 1
        session.commit()
        return True


def uznat_termin(session, id_terminu, id_studenta, zvolene_datum_splneni=None):
    termin = session.query(HistorieTerminu).filter(HistorieTerminu.termin_id == id_terminu, HistorieTerminu.student_id == id_studenta).first()
    termin.datum_splneni = zvolene_datum_splneni or datetime.now()
    session.commit()
    return True

def pridat_studenta(session, student_id, termin_id):
    session.query(HistorieTerminu).add(uuid.uuid4(),student_id, termin_id)
    termin = session.query(Termin).filter(Termin.id == termin_id).first()
    termin.aktualni_kapacita += 1
    session.commit()
    return True

### PREDMETY
def vytvor_predmet(session,kod_predmetu,zkratka_predmetu,katedra,vyucuje_id):
    predmet=Predmet(kod_predmetu=kod_predmetu,zkratka_predmetu=zkratka_predmetu,katedra=katedra,vyucuje_id=vyucuje_id)
    session.add(predmet)
    session.commit()
    return True
def list_predmety(session):
    predmety = session.query(Predmet).all()
    for predmet in predmety:
        print(f"Kod: {predmet.kod_predmetu}, Zkratka: {predmet.zkratka_predmetu}, Katedra: {predmet.katedra}, Vyucujici: {predmet.vyucuje.prijmeni}")
    predmet_list = [predmet for predmet in predmety]
    return predmet_list
### TERMINY
def list_terminy(session):
    terminy = session.query(Termin).all()
    for termin in terminy:
        print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Date: {termin.datum}, Room: {termin.ucebna}, Vyucujici: {termin.vyucuje.prijmeni}, Vypsal: {termin.vypsal.prijmeni}, Aktualni kapacita: {termin.aktualni_kapacita}, Max kapacita: {termin.max_kapacita}")
    termin_list = [termin for termin in terminy]
    return termin_list

def vypsat_termin(session, id:UUID, ucebna:Text, datum:datetime, aktualni_kapacita:int, max_kapacita:int, vypsal_id:UUID, vyucuje_id:UUID, kod_predmet:Text, jmeno:Text):
    termin = Termin(id=id, ucebna=ucebna, datum=datum, aktualni_kapacita=aktualni_kapacita, max_kapacita=max_kapacita, vypsal_id=vypsal_id, vyucuje_id=vyucuje_id, kod_predmet=kod_predmet, jmeno=jmeno)
    session.add(termin)
    session.commit()
    return True

def list_nadchazejici_terminy(session):
    dnesni_datum = datetime.now()
    terminy = session.query(Termin).filter(Termin.datum >= dnesni_datum).all()
    for termin in terminy:
        print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Date: {termin.datum}, Room: {termin.ucebna}")
    terminy_list = [termin for termin in terminy]
    return terminy_list

def list_probehle_terminy(session):
    dnesni_datum = datetime.now()
    terminy = session.query(Termin).filter(Termin.datum <= dnesni_datum).all()
    for termin in terminy:
        print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Date: {termin.datum}, Room: {termin.ucebna}")
    terminy_list = [termin for termin in terminy]
    return terminy_list

def list_planovane_terminy_predmet(session, kod_predmetu):
    dnesni_datum = datetime.now()
    terminy = session.query(Termin).filter(Termin.kod_predmet == kod_predmetu, Termin.datum >= dnesni_datum).all()
    for termin in terminy:
        print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Vyucujici: {termin.vyucuje.prijmeni}, Vypsal: {termin.vypsal.prijmeni}, Date: {termin.datum}, Room: {termin.ucebna}")
    terminy_list = [termin for termin in terminy]
    return terminy_list

def list_probehle_terminy_predmet(session, kod_predmetu):
    dnesni_datum = datetime.now()
    terminy = session.query(Termin).filter(Termin.kod_predmet == kod_predmetu, Termin.datum <= dnesni_datum).all()
    for termin in terminy:
        print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Vyucujici: {termin.vyucuje.prijmeni}, Vypsal: {termin.vypsal.prijmeni}, Date: {termin.datum}, Room: {termin.ucebna}")
    terminy_list = [termin for termin in terminy]
    return terminy_list

def list_terminy_vyucujici(session, id):
    terminy = session.query(Termin).filter(Termin.vyucuje_id == id).all()
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
    pass