from sqlalchemy import create_engine, MetaData, Table, ForeignKey, Column, String, Integer, Text, UUID, DateTime
from sqlalchemy.orm import sessionmaker, relationship, declarative_base
import os, dotenv
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
    vypsal_id = Column(UUID, ForeignKey('vyucujici.id'))
    vyucuje_id = Column(UUID, ForeignKey('vyucujici.id'))
    kod_predmet = Column(Text, ForeignKey('predmet.kod_predmetu'))

    predmet = relationship('Predmet', back_populates="termin")
    vypsal = relationship('Vyucujici', foreign_keys=[vypsal_id], back_populates="terminy_vypsal")
    vyucuje = relationship('Vyucujici', foreign_keys=[vyucuje_id], back_populates="terminy_vyucuje")
    historie_terminu = relationship('HistorieTerminu', back_populates="termin")


class Vyucujici(Base):
    __tablename__ = "vyucujici"

    id = Column("id", UUID, primary_key=True)
    prijmeni = Column("prijmeni", Text)

    terminy_vyucuje = relationship("Termin", foreign_keys=[Termin.vyucuje_id], back_populates="vyucuje")
    terminy_vypsal = relationship("Termin", foreign_keys=[Termin.vypsal_id], back_populates="vypsal")
    predmet = relationship("Predmet", back_populates="vyucuje")


class Predmet(Base):
    __tablename__ = "predmet"

    kod_predmetu = Column("kod_predmetu", Text, primary_key=True)
    zkratka_predmetu = Column("zkratka_predmetu", Text)
    katedra = Column("katedra", Text)
    vyucuje_id = Column("vyucujici_id", UUID, ForeignKey('vyucujici.id'))

    vyucuje = relationship('Vyucujici', back_populates="predmet")
    termin = relationship('Termin', back_populates="predmet")
    zapsane_predmety = relationship('ZapsanePredmety', back_populates="predmet")


class Student(Base):
    __tablename__ = "student"

    id = Column("id", UUID, primary_key=True)
    datum_vytvoreni = Column("datum_vytvoreni", DateTime)

    zapsane_predmety = relationship('ZapsanePredmety', back_populates="student")
    historie_terminu = relationship('HistorieTerminu', back_populates="student")


class ZapsanePredmety(Base):
    __tablename__ = "zapsane_predmety"

    id = Column("id", UUID, primary_key=True)
    zapsano = Column("zapsano", DateTime)
    student_id = Column(UUID, ForeignKey('student.id'))
    kod_predmet = Column(Text, ForeignKey('predmet.kod_predmetu'))

    student = relationship('Student', back_populates="zapsane_predmety")
    predmet = relationship('Predmet', back_populates="zapsane_predmety")


class HistorieTerminu(Base):
    __tablename__ = "historie_terminu"

    id = Column("id", UUID, primary_key=True)
    student_id = Column(UUID, ForeignKey('student.id'))
    termin_id = Column(UUID, ForeignKey('termin.id'))

    student = relationship('Student', back_populates="historie_terminu")
    termin = relationship('Termin', back_populates="historie_terminu")



### TVORBA UZIVATEL
def vytvor_student(session, id):
    student = Student(id=id, datum_vytvoreni=DateTime.now())
    session.add(student)
    session.commit()
def pridej_vyucujici(session, id, prijmeni):
    vyucujici = Vyucujici(id=id, prijmeni=prijmeni)
    session.add(vyucujici)
    session.commit()

### USER ACTIONS
def zapis_predmet(session):
    pass
def upravit_termin(session):
    pass
def uznat_termin(session):
    pass
def pridat_studenta(session):
    pass

### PREDMETY
def vytvor_predmet(session):
    pass
def list_predmety(session):
    pass

### TERMINY
def list_terminy(session):
    session.query(Termin).all()
def vypsat_termin(session):
    pass
def list_nadchazejici_terminy(session):
    dnesni_datum = datetime.now()
    terminy = session.query(Termin).filter(Termin.datum >= dnesni_datum).all()
    for termin in terminy:
        print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Date: {termin.datum}, Room: {termin.ucebna}")
def list_probehle_terminy(session):
    dnesni_datum = datetime.now()
    terminy = session.query(Termin).filter(Termin.datum <= dnesni_datum).all()
    for termin in terminy:
        print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Date: {termin.datum}, Room: {termin.ucebna}")
def list_planovane_terminy_predmet(session):
    pass
def list_probehle_terminy_predmet(session):
    pass

def historie_studenta(session, id):
    student = session.query(Student).filter_by(id=id).first()
    if student is None:
        print("Neplatne ID studenta!")
        return
    for history in student.historie_terminu:
        termin = history.termin
        print(f"Term: {termin.jmeno}, Predmet: {termin.kod_predmet}, Date: {termin.datum}, Room: {termin.ucebna}")





if __name__ == "__main__":
    historie_studenta(session,'0d162f64-61dd-446d-a3e2-404a994e9a9f')
    list_probehle_terminy(session)

