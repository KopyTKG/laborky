from sqlalchemy import create_engine, MetaData, Table, ForeignKey, Column, String, Integer, Text, UUID, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os, dotenv

dotenv.load_dotenv()
DATABASE_URL= os.getenv('DB_URL')

engine = create_engine(DATABASE_URL)

metadata = MetaData()

metadata.reflect(bind=engine)

Base = declarative_base()

class Termin(Base):
    __tablename__ = "termin"

    id = Column("id", UUID, primary_key=True)
    ucebna = Column("ucebna", Text)
    datum = Column("datum", DateTime)
    aktualni_kapacita = Column("aktualni_kapacita", Integer)
    max_kapacita = Column("max_kapacita", Integer)
    vypsal_id = Column(UUID, ForeignKey('vyucujici.id'))
    vyucuje_id = Column(UUID, ForeignKey('vyucujici.id'))
    kod_predmet = Column(Text, ForeignKey('predmet.kod_predmetu'))

    predmet = relationship('Predmet', back_populates="termin")
    vypsal = relationship('Vyucujici', back_populates="termin")
    vyucuje = relationship('Vyucujici', back_populates="termin")

class Vyucujici(Base):
    __tablename__ = "vyucujici"

    id = Column("id", UUID, primary_key=True)
    prijmeni = Column("prijmeni", Text)

    termin = relationship("Termin", back_populates="vyucuje")
    termin = relationship("Termin", back_populates="vypsal")
    termin = relationship("Termin", back_populates="predmet")

    predmet = relationship("Predmet", back_populates="vyucuje")


class Predmet(Base):
    __tablename__ = "predmet"

    kod_predmetu = Column("kod_predmetu", Text, primary_key=True)
    zkratka_predmetu = Column("zkratka_predmetu", Text)
    katedra = Column("katedra", Text)
    vyucuje_id = Column(UUID, ForeignKey('vyucujici.id'))

    vyucuje = relationship('Vyucujici', back_populates="predmet")

class Student(Base):
    __tablename__ = "student"

    id = Column("id", UUID, primary_key=True)
    datum_vytvoreni = Column("datum_vytvoreni", DateTime)

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


# print("Tables in the database:")
# for table_name in metadata.tables.keys():
#     print(table_name)

