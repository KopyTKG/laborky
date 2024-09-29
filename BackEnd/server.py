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

    userinfo = get_stag_user_info(ticket)
    userid, role = get_userid_and_role(userinfo)

        # check s databazi
        # vrati OK 200?

    return "login do databaze", userid, role


### Student API
## /STUDENT HOME
@app.get("/student/{osobni_cislo}")
async def get_student_home(): #prijima parametr ticket
    """ Vrácení všech vypsaných laborek podle toho, na co se student může zapsat """
    ticket = os.getenv('TICKET') # prozatimni reseni

    # provede:
    predmety_k_dispozici = get_predmet_student_k_dispozici(ticket, predmety_pro_cviceni())
        # jake jsou laborky k dispozici na dany predmet (DB)=
        
        # vraci json vsech laborek, ktere jsou k dispozici
        # student na nich neni zapsan!!

    return "student home"


#post
@app.get("/student/{osobni_cislo}/{id_lab}")
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


#post
@app.get("/student/{osobni_cislo}/moje/{id_lab}")
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
@app.get("/ucitel/board")
async def get_ucitel_board(): #prijima ticket
    """ Vrátí všechny vypsané cvičení """

    # provede:
        # DB - všechny termíny sestupně podle data

    return "vsechna vypsana cviceni EVER"


@app.get("/ucitel/{ucitIdnu}")
async def get_ucitel_moje_vypsane():
    """ Vrátí všechny cvičení, které vypsal uživatel """
    # ticket - user - role
    # provede:
        # DB - všechny cvícení, které vypsal uživatel
        # vrací cvičení

    return "ucitel moje vypsane cviceni"


@app.get("/ucitel/board/{predmet}")
async def get_terminy_by_predmet():
    """ Vrátí všechny vypsané termíny pro daný předmět """
    # provede:
        # DB - všechny cvičení pro daný předmět

    return "cviceni pro dany predmet"


#post
@app.get("/ucitel/termin/{megamocsracek}")
async def ucitel_vytvor_termin():
    """ Učitel vytvoří termín do databáze """

    # ticket

    # mistnost, datastart, dateend, kapacitamax, nazev, predmet, ucitel (ticket)

    # provede:
        # DB - vytvoreni noveho terminu v DB

    return "ok provedeno :-)"


#put
@app.get("/ucitel/terminedit/{id_terminu}")
async def ucitel_zmena_terminu():
    """ Učitel změní parametry v již vypsaném termínu """
    # ticket
    # crUd operace pro adama


## /UCITEL STUDENTI
@app.get("/ucitel/studenti/{id_lab}")
async def get_vypis_studentu(): #prijima parametr ticket
    """ Vrácení všech studentů, kteří se zapsali na daný seminář"""
    ticket = os.getenv('TICKET') # prozatimni reseni

        # DB - vsechny studenty (Fcisla) s relaci pro id_lab
        # nacist udaje o studentech : Jmeno, Prijmeni
        # vraci jmena studentu
    student_info = get_studenti_info(ticket, ["F21B0402P", "E22P9041P"])

    return "jmena studentu + fnu pro dany lab", student_info


@app.get("/ucitel/zapis/{id_lab}/{id_stud}")
async def post_ucitel_zapsat_studenta():
    """ Ručně přihlásí studenta do vypsaného termínu cvičení """
    # ticket
    # provede:
        # DB - najde studenta podle id_studenta
            # pokud nebude - vyhodi ALERT! - student se musí nejprve zaregistrovat
            # return "kokot se musi nejdriv zaregistrovat >:("
            # pokud bude - vytvor relaci mezi studentem a terminem
            # ! pokud je room plna, nevadi to
            # kapacita terminu +1		    

    return "ok provedeno :-)"


@app.get("/ucitel/splneno/{id_lab}/{id_stud}")
async def post_ucitel_splnit_studentovi():
    """ Zapsat studentovi, že má splněný určitý termín cvičení """
    # provede:
        # date = curr.date
        # DB - marked as splněno (přidá se date do relace)
     
    return "ok"
    

@app.get("/ucitel/emaily/{id_lab}")
async def get_ucitel_emaily():
    """ Vrátí xslx soubor s emailama studentů přihlášených na daném termínu """
    # ticket
    # provede:
        # DB - vsechny Fcisla, ktere maji relaci s terminem
        # DB - predmet, ktereho se to tyka
        # stag API: vyhledej vsechny uzivatele, kteri maji zapsany dany predmet
            # student - jmeno + prijmeni + mail
        # vraci json
    return "json vsech informaci, na ktere nemame prava je uchovavat :-)"

@app.get("/")
async def root():
    ticket = os.getenv('TICKET')
    predmety = predmety_pro_cviceni()
    
    user = get_stag_user_info(ticket)
    userid, role = get_userid_and_role(user)

    return userid, role

    



if __name__ == "__main__":
    dotenv.load_dotenv()
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
