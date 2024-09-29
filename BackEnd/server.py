import uvicorn
from fastapi import FastAPI
from classes.stag import *
from classes.db import *
from classes.vyucujici import *
from classes.student import *
from jose import jwt
import dotenv, os, requests, json
from lib.conn import *

dotenv.load_dotenv()

app = FastAPI(debug=True)


@app.get("/setup")
async def setup(): # prijima parametr ticket (ticket: str | None = None)
    """ Kontrola přihlášeného uživatele s databází po loginu do systému """
    ticket = os.getenv("TICKET")
    if ticket is None or ticket == "":
        return 401
    userinfo = get_stag_user_info(ticket)
    userid, role = get_userid_and_role(userinfo)
    if role != "ST":
        prijmeni = userinfo["prijmeni"]
        userid = "1f92a11172f3109d2529461a19e49dbace23fb32"
        pridej_vyucujici(session, userid, prijmeni)
    else: 
        vytvor_student(session, userid)
    return "login do databaze", userid, role


### Student API
## /STUDENT HOME
@app.get("/student") #/student/{osobni_cislo}
async def get_student_home(): #prijima parametr ticket ticket: str | None = None
    """ Vrácení všech vypsaných laborek podle toho, na co se student může zapsat """
    #if ticket is None or ticket == "":
    #    return 401
    ticket = os.getenv('TICKET') # prozatimni reseni

    # provede:
    predmety_k_dispozici = get_predmet_student_k_dispozici(ticket, predmety_pro_cviceni())
    list_terminu = list_dostupnych_terminu(session)
        # jake jsou laborky k dispozici na dany predmet (DB)=
        
        # vraci json vsech laborek, ktere jsou k dispozici
        # student na nich neni zapsan!!

    return json.dump(list_terminu)


#post
# Change state v labu, jestli se tam přihlašuje nebo odhlašuje
@app.get("/student/{id_lab}") #osobni číslo gone again
async def zmena_statusu_zapsani(): # prijima argument id labu, na ktery se student registruje, ticket : str | None = None, typ:str
    """ Zaregistruje, či se odhlásí z labu, na základě ukázky na hlavní straně """
    ticket = os.dotenv("TICKET")
    if ticket is None or ticket == "":
        return 401
    userinfo = get_stag_user_info(ticket)
    userid, role = get_userid_and_role(userinfo)
    #HASH STUDENT
    if typ == "zapsat":
        if zapsat_se_na_termin(session, userid, id_lab):
            return 200
        else:
            return 469
    elif typ == "odhlasit":
        if odepsat_se_z_terminu(session, userid, id_lab):
            return 200
        else:
            return 400

## /STUDENT MOJE
@app.get("/student/moje")
async def get_student_moje(ticket : str | None = None): #prijima parametr ticket
    """ Vrátí cvičení, na kterých je student aktuálně zapsán"""
    if ticket is None or ticket == "":
        return 401
    # ticket = os.getenv('TICKET') # prozatimni reseni

    # provede:
        # DB podle jeho osobniho cisla, kde je student zapsan =

        # vraci seznam cviceni, ktere ma student zapsany

    return "student zapsane terminy"

## PROFIL
@app.get("/profil") # Profil pro studenta a ucitele
async def get_student_profil(ticket : str | None = None): #prijima parametr ticket
    """ Vraci zaznam o vsech typech cviceni na dany seznam predmetu, zda je student splnil ci nikoli"""
    ticket = os.getenv("TICKET") # prozatimni reseni

    # provede:
        # DB podle osobniho cisla, vrati zda student ma v minulosti splneno jaky typ cviceni
        # to, co nema oznaceno jako splnil a nebo je zapsan a hodina jeste neprobehla, ma jako nesplnil

        # vraci predmet - seminare a u kazdeho jestli splnil nebo ne

    return "student profil"


### Ucitel API 
#Cvičení příští týden
@app.get("/ucitel/nadchazejici")
async def get_ucitel_board_next_ones(ticket: str | None = None):
    """Vrátí cvičení v dalším týdnu"""
    if ticket is None or ticket == "":
        return 401
    return "další cvícení v dalším týdnu"

#Všechny týdny
@app.get("/ucitel/board")
async def get_ucitel_board(ticket: str | None = None): #prijima ticket
    """ Vrátí všechny vypsané cvičení """
    if ticket is None or ticket == "":
        return 401 
    # provede:
        # DB - všechny termíny sestupně podle data

    return "vsechna vypsana cviceni EVER"


@app.get("/ucitel/moje")
async def get_ucitel_moje_vypsane(ticket : str | None = None):
    """ Vrátí všechny cvičení, které vypsal uživatel """
    if ticket is None or ticket == "":
        return 401
    # ticket - user - role
    # provede:
        # DB - všechny cvícení, které vypsal uživatel
        # vrací cvičení

    return "ucitel moje vypsane cviceni"


@app.get("/ucitel/board/{predmet}")
async def get_terminy_by_predmet(ticket: str | None = None):
    """ Vrátí všechny vypsané termíny pro daný předmět """
    # provede:
        # DB - všechny cvičení pro daný předmět

    return "cviceni pro dany predmet"


@app.post("/ucitel/termin/{megamocsracek}")
async def ucitel_vytvor_termin(ticket: str | None = None):
    """ Učitel vytvoří termín do databáze """

    # ticket

    # mistnost, datastart, dateend, kapacitamax, nazev, predmet, ucitel (ticket)

    # provede:
        # DB - vytvoreni noveho terminu v DB

    return "ok provedeno :-)"


@app.patch("/ucitel/termin/{id_terminu}")
async def ucitel_zmena_terminu(ticket: str | None = None):
    """ Učitel změní parametry v již vypsaném termínu """
    # ticket
    # crUd operace pro adama
@app.delete("/ucitel/termin/{id_terminu}")
async def ucitel_smazani_terminu(ticket: str | None = None):
    """ Učitel smáže vypsaný termín """
    # ticket
    # cruD operace pro adama

## /UCITEL STUDENTI
@app.get("/ucitel/studenti/{id_lab}")
async def get_vypis_studentu(ticket: str | None = None): #prijima parametr ticket
    """ Vrácení všech studentů, kteří se zapsali na daný seminář"""
    # ticket = os.getenv('TICKET') # prozatimni reseni

        # DB - vsechny studenty (Fcisla) s relaci pro id_lab
        # nacist udaje o studentech : Jmeno, Prijmeni
        # vraci jmena studentu
    student_info = get_studenti_info(ticket, ["F21B0402P", "E22P9041P"])

    return "jmena studentu + fnu pro dany lab", student_info


@app.post("/ucitel/zapis/{id_lab}/")
async def post_ucitel_zapsat_studenta(ticket: str | None = None, id_stud: str | None = None):
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


@app.post("/ucitel/splneno/{id_lab}/")
async def post_ucitel_splnit_studentovi(ticket: str | None = None, id_stud: str | None = None):
    """ Zapsat studentovi, že má splněný určitý termín cvičení """
    
    # provede:
        # date = curr.date
        # DB - marked as splněno (přidá se date do relace)
     
    return "ok"
    

@app.get("/ucitel/emaily/{id_lab}")
async def get_ucitel_emaily(ticket: str | None = None):
    """ Vrátí xslx soubor s emailama studentů přihlášených na daném termínu """
    # ticket
    # provede:
        # DB - vsechny Fcisla, ktere maji relaci s terminem
        # DB - predmet, ktereho se to tyka
        # stag API: vyhledej vsechny uzivatele, kteri maji zapsany dany predmet /ws/services/rest2/student/getStudentInfo
            # student - jmeno + prijmeni + mail
        # vraci json
    return "json vsech informaci, na ktere nemame prava je uchovavat :-)"


@app.get("/")
async def root():
    ticket = os.getenv('TICKET')
    predmety = predmety_pro_cviceni()
    
    user = get_stag_user_info(ticket)
    prijmeni = user["prijmeni"]
    userid, role = get_userid_and_role(user)

    return user

    



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
