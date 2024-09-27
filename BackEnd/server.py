import uvicorn
from fastapi import FastAPI
from classes.stag import *
from classes.db import *
from classes.vyucujici import *
from classes.student import *
from jose import jwt
import dotenv, os, requests, json


dotenv.load_dotenv()

app = FastAPI(debug=True)


@app.get("/setup")
async def setup(): # prijima parametr ticket
    """ Kontrola přihlášeného uživatele s databází po loginu do systému """
    ticket = os.getenv('TICKET') # prozatimni reseni

    # provede:
        # role uzivatele =
        # userId uzivatele =

        # check s databazi
        # vrati OK 200?

    return "login do databaze"


### Student API
## /STUDENT HOME
@app.get("/student/{osobni_cislo}")
async def get_student_home(): #prijima parametr ticket
    """ Vrácení všech vypsaných laborek podle toho, na co se student může zapsat """
    ticket = os.getenv('TICKET') # prozatimni reseni

    # provede:
        # laborky jakeho seminare ma student na vyber =
        # jake jsou laborky k dispozici na dany predmet (DB)=
        
        # vraci json vsech laborek, ktere jsou k dispozici
        # student na nich neni zapsan!!

    return "student home"


@app.post("/student/{osobni_cislo}/{id_lab}")
async def add_student_to_lab(): # prijima argument id labu, na ktery se student registruje
    """ Zaregistruje studenta do labu, který je k dispozici na jeho hlavní straně """

    # provede:
        # DB relace mezi studentem a labem
        # prida do laborek +1 na obsazenost

        # vraci ok 200?


## /STUDENT MOJE
@app.get("/student/{osobni_cislo}/moje")
async def get_student_moje(): #prijima parametr ticket
    """ Vrátí cvičení, na kterých je student aktuálně zapsán"""
    ticket = os.getenv('TICKET') # prozatimni reseni

    # provede:
        # DB podle jeho osobniho cisla, kde je student zapsan =

        # vraci seznam cviceni, ktere ma student zapsany

    return "student zapsane terminy"


@app.post("/student/{osobni_cislo}/moje/{id_lab}")
async def remove_student_from_lab():
    """ Odhlášení studenta ze cvičení podle id cvičení """

    # provede:
        # zruší relaci mezi studentem a cvičením
        # odečte 1 od obsazenosti cvičení

        # vraci ok 200?


## /STUDENT PROFIL
@app.get("/student/{osobni_cislo}/profil")
async def get_student_profil(): #prijima parametr ticket
    """ Vraci zaznam o vsech typech cviceni na dany seznam predmetu, zda je student splnil ci nikoli"""
    ticket = os.getenv("TICKET") # prozatimni reseni

    # provede:
        # DB podle osobniho cisla, vrati zda student ma v minulosti splneno jaky typ cviceni
        # to, co nema oznaceno jako splnil a nebo je zapsan a hodina jeste neprobehla, ma jako nesplnil

        # vraci predmet - seminare a u kazdeho jestli splnil nebo ne

    return "student profil"


### Ucitel API 
## /UCITEL HOME





## /UCITEL PREDMETY




## /UCITEL STUDENTI
@app.get("/ucitel/studenti")
async def get_vypis_studentu(): #prijima parametr ticket
    """ Vrácení všech studentů, kteří se zapsali na daný seminář"""
    ticket = os.getenv('TICKET') # prozatimni reseni

    return "x"





@app.get("/")
async def root():
    ticket = os.getenv('TICKET')
    predmety = predmety_pro_cviceni()
    user = GetUcitelPredmety(ticket) 
    return user

    



if __name__ == "__main__":
    uvicorn.run(app, host=os.getenv('HOST'), port=int(os.getenv('PORT')))




"""
url = "https://stag-demo.zcu.cz/ws/services/rest2/rozvrhy/getRozvrhByMistnost"
params = {
    'budova':'CP',
    'mistnost':'6.13',
    'semestr': 'ZS',
    'katedra': 'KI',
}
ticket = 'a7fdf5c7e56ebdc48356eb0a3701ad5fa5524f8920d36f4c11ca4681aec209f4'
response = Get(url=url,params=params,ticket=ticket)
print(response)
with open("dump.json", "w") as outfile:
json.dump(response, outfile)
"""
