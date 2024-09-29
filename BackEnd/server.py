import uvicorn
from fastapi import FastAPI
from classes.stag import *
from classes.db import *
from classes.vyucujici import *
from classes.student import *
from lib.conn import *
from lib.HTTP_messages import *
from jose import jwt
import dotenv, os, requests, json

dotenv.load_dotenv()

app = FastAPI(debug=True)


@app.get("/setup")
async def setup(): # prijima parametr ticket (ticket: str | None = None)
    """ Kontrola přihlášeného uživatele s databází po loginu do systému """
    ticket = os.getenv("TICKET")
    if ticket is None or ticket == "":
        return unauthorized
    userinfo = get_stag_user_info(ticket)
    userid, role = get_userid_and_role(userinfo)
    if role != "ST":
        prijmeni = userinfo["prijmeni"]
        userid = encode_id(userid)
        pridej_vyucujici(session, userid, prijmeni)
    else:
        userid = encode_id(userid) 
        vytvor_student(session, userid)
    return "login do databaze", userid, role


### Student API
## /STUDENT HOME
@app.get("/student") #/student/{osobni_cislo}
async def get_student_home(): #prijima parametr ticket ticket: str | None = None
    """ Vrácení všech vypsaných laborek podle toho, na co se student může zapsat """
    
    ticket = os.getenv('TICKET') # prozatimni reseni
    if ticket is None or ticket == "":
        return unauthorized

    # provede:
    predmety_k_dispozici = get_predmet_student_k_dispozici(ticket, predmety_pro_cviceni())
    list_terminu = list_dostupnych_terminu(session, predmety_k_dispozici)
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
        return unauthorized
    userinfo = get_stag_user_info(ticket)
    userid, role = get_userid_and_role(userinfo)
    userid = encode_id(userid)
    if typ == "zapsat":
        if zapsat_se_na_termin(session, userid, id_lab):
            return ok
        else:
            return conflict
    elif typ == "odhlasit":
        if odepsat_se_z_terminu(session, userid, id_lab):
            return ok
        else:
            return bad_request

## /STUDENT MOJE
@app.get("/student/moje")
async def get_student_moje(): #prijima parametr ticket ticket : str | None = None 
    """ Vrátí cvičení, na kterých je student aktuálně zapsán"""
    ticket = os.getenv('TICKET')
    if ticket is None or ticket == "":
        return unauthorized
    userid, role = get_userid_and_role(get_stag_user_info(ticket))
    userid = encode_id(userid)
    list_terminu = historie_studenta(session, userid)

    return json.dump(list_terminu)

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
# TOHLE DODĚLAT
@app.get("/ucitel/nadchazejici")
async def get_ucitel_board_next_ones(): # ticket: str | None = None
    """Vrátí cvičení v dalším týdnu"""
    ticket = os.getenv("TICKET")
    if ticket is None or ticket == "":
        return unauthorized
    return "další cvícení v dalším týdnu"

#Všechny týdny
@app.get("/ucitel/board")
async def get_ucitel_board(): #prijima ticket ticket: str | None = None
    """ Vrátí všechny vypsané cvičení """
    ticket = os.getenv("TICKET")
    if ticket is None or ticket == "":
        return unauthorized

    list_terminu = list_terminy(session)
    # provede:
        # DB - všechny termíny sestupně podle data

    return json.dump(list_terminu)


@app.get("/ucitel/moje")
async def get_ucitel_moje_vypsane(): # ticket : str | None = None
    """ Vrátí všechny cvičení, které vypsal uživatel """
    ticket = os.getenv("TICKET")
    if ticket is None or ticket == "":
        return unauthorized
    userid, role = get_userid_and_role(get_stag_user_info(ticket))
    userid = encode_id(userid)
    list_terminu = list_terminy_vyucujici(session, userid)
    return json.dump(list_terminu)


@app.get("/ucitel/board/{predmet}")
async def get_terminy_by_predmet(): #ticket: str | None = None
    """ Vrátí všechny vypsané termíny pro daný předmět """
    ticket = os.getenv("TICKET")
    if ticket is None or ticket == "":
        return unauthorized
    terminy_dle_predmetu_old = list_probehle_terminy_predmet(session, predmet)
    terminy_dle_predmetu_new = list_planovane_terminy_predmet(session, predmet)
    list_terminu = terminy_dle_predmetu_new + terminy_dle_predmetu_old
    return json.dump(list_terminu)


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
async def get_vypis_studentu(): #prijima parametr ticket: str | None = None, katedra: str, zkratka_predmetu: str
    """ Vrácení všech studentů, kteří se zapsali na daný seminář"""
    ticket = os.getenv('TICKET') # prozatimni reseni
    if ticket is None or ticket == "":
        return unauthorized
    list_studentu = list_studenti_z_terminu(session, id_lab)
    vsichni_studenti = get_studenti_na_predmetu(ticket, katedra, zkratka_predmetu)
    dekodovane_cisla = compare_encoded(hash_studentu_na_terminu, studenti_na_predmetu)
    jmena_studentu = get_studenti_info(ticket,  dekodovane_cisla)
        # DB - vsechny studenty (Fcisla) s relaci pro id_lab
        # nacist udaje o studentech : Jmeno, Prijmeni, mail
        # vraci jmena studentu
    
    return json.dump(jmena_studentu)


@app.post("/ucitel/zapis/{id_lab}/")
async def post_ucitel_zapsat_studenta(): #ticket: str | None = None, id_stud: str | None = None
    """ Ručně přihlásí studenta do vypsaného termínu cvičení """
    ticket = os.getenv("TICKET")
    if ticket is None or ticket == "":
        return unauthorized
    id_stud = encode_id(id_stud)
    if pridat_studenta(session, id_stud, id_lab):
        return ok
    else:
        return not_found
    # ticket
    # provede:
        # DB - najde studenta podle id_studenta
            # pokud nebude - vyhodi ALERT! - student se musí nejprve zaregistrovat
            # return "kokot se musi nejdriv zaregistrovat >:("
            # pokud bude - vytvor relaci mezi studentem a terminem
            # ! pokud je room plna, nevadi to
            # kapacita terminu +1		    

@app.post("/ucitel/splneno/{id_lab}/")
async def post_ucitel_splnit_studentovi(): #ticket: str | None = None, id_stud: str | None = None, date: date
    """ Zapsat studentovi, že má splněný určitý termín cvičení """
    ticket = os.getenv("TICKET")
    if ticket is None or ticket == "":
        return unauthorized
    id_stud = encode_id(id_stud)
    if uznat_termin(session, id_terminu, id_studenta, zvolene_datum_splneni):
        return ok
    else:
        return not_found
    
    # provede:
        # date = curr.date
        # DB - marked as splněno (přidá se date do relace)

@app.get("/ucitel/emaily/{id_lab}")
async def get_ucitel_emaily(): #ticket: str | None = None
    """ Vrátí xslx soubor s emailama studentů přihlášených na daném termínu """
    ticket = os.getenv("TICKET")
    if ticket is None or ticket == "":
        return unauthorized
    list_studentu = list_studenti_z_terminu(session, id_lab)
    vsichni_studenti = get_studenti_na_predmetu(ticket, katedra, zkratka_predmetu)
    dekodovane_cisla = compare_encoded(hash_studentu_na_terminu, studenti_na_predmetu)
    emaily_studentu = get_studenti_info(ticket,  dekodovane_cisla)
    emaily_studentu = emaily_studentu[::3]
    json_emailu = json.dump(emaily_studentu)
    return json_emailu
    # provede:
        # DB - vsechny Fcisla, ktere maji relaci s terminem
        # DB - predmet, ktereho se to tyka
        # stag API: vyhledej vsechny uzivatele, kteri maji zapsany dany predmet /ws/services/rest2/student/getStudentInfo
            # student - jmeno + prijmeni + mail
        # vraci json


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
