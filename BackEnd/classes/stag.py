import requests
import os
from lib.HTTP_messages import *


def get(ticket, url, params):
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive", 
        "Accept-Origin": "https://stag-demo.zcu.cz",
    }
    url = os.getenv('STAG_URL') + url
    response = requests.get(url, params=params, headers=headers, cookies={'WSCOOKIE': ticket})
    if not response.ok: 
        raise Exception(response.text)
    try:
        response = response.json()
    except:
        return None
    return response


def get_stag_user_info(ticket):
    """ Vrátí jméno, příjmení, email, titul a stagUserInfo (username, role, nazev, ucitIdno/osCilo, email)"""
    url = os.getenv('STAG_URL') + "ws/services/rest2/help/getStagUserListForLoginTicketV2?ticket=" + ticket  # type: ignore
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive", 
        "Accept-Origin": "https://stag-demo.zcu.cz",
    }
    response = requests.get(url, headers=headers)
    if not response.ok:
        return None
    try:
        response = response.json()
    except:
        return None
    return response


def bool_existuje_predmet(ticket, katedra, zkratka_predmetu):
    """ Vrátí informace o předmětu """
    url = os.getenv('STAG_URL') + "ws/services/rest2/predmety/getPredmetInfo" # type: ignore
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive", 
        "Accept-Origin": "https://stag-demo.zcu.cz",
    }
    params = {
        "katedra": katedra,
        "zkratka": zkratka_predmetu
    }
    response = requests.get(url, headers=headers, params=params)
    if not response.ok:
        return None
    try:
        response = response.json()
        if response:
            return True
        else:
            return False
    except:
        return None
    return response


def get_vyucujici_predmetu_stag(zkratka_predmetu, katedra):
    """ Vrátí informace o predmetu"""
    params = {
        "katedra": katedra,
        "zkratka": zkratka_predmetu
    }
    url= os.getenv('STAG_URL') + "ws/services/rest2/predmety/getPredmetInfo" # type: ignore
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive", 
        "Accept-Origin": "https://stag-demo.zcu.cz",
    }
    response = requests.get(url, headers=headers, params=params)
    if not response.ok:
        return "chyba"
    
    try:
        response = response.json()
    except:
        return None
    return response["cvicici"]


def get_userid_and_role(json):
    """ Vrací userId a roli uživatele
    json: json, který vrací funkce "get_stag_user_info"""
    role = json["stagUserInfo"][0]["role"]
    if role == "":
        return internal_server_error, internal_server_error
    if role != "ST":
        userid = str(json["stagUserInfo"][0]["ucitIdno"])
    else:
        userid = str(json["stagUserInfo"][0]["osCislo"])
    return userid, role
