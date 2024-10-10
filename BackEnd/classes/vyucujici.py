import requests
import hashlib
from classes.stag import *
import os

def get_student_info(ticket, osobni_cislo):
    """ Vrátí informace o studentovi podle osobního čísla """
    try:
        params = {
            "osCislo": osobni_cislo,
        }
        headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Connection": "keep-alive",
            "Accept-Origin": os.getenv("STAG_URL"),
        }

        url = os.getenv('STAG_URL') + "ws/services/rest2/student/getStudentInfo"
        response = requests.get(url, params=params, headers=headers, cookies={'WSCOOKIE': ticket}).json()
    except:
        return internal_server_error

        jmeno = response["jmeno"]
        prijmeni = response["prijmeni"]
        email = response["email"]

        return jmeno, prijmeni, email


def get_student_predmety(ticket, osobni_cislo, predmety_db):
    """ Vrátí informace o studentovi podle osobního čísla """
    try:
        params = {
            "osCislo": osobni_cislo,
        }
        headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Connection": "keep-alive",
            "Accept-Origin": os.getenv("STAG_URL"),
        }
        url = os.getenv('STAG_URL') + "ws/services/rest2/rozvrhy/getRozvrhByStudent"
        response = requests.get(url, params=params, headers=headers, cookies={'WSCOOKIE': ticket}).json()
    except:
        return not_found
    response = response["rozvrhovaAkce"]
    predmety = []
    predmety_db = [predmet_db.kod_predmetu for predmet_db in predmety_db] 
    for predmet in response:
        kod = (predmet["katedra"] + "/" + predmet["predmet"])
        if kod in predmety_db:
            if kod not in predmety:
                predmety.append(kod)

    return predmety

def get_studenti_info(ticket, list_studentu):
    """ Vrátí informace o studentech podle osobního čísla """
    info = []
    for student in list_studentu:
        jmeno, prijmeni, email = get_student_info(ticket, student)
        student_info = {"osCislo": student, "jmeno": jmeno, "prijmeni": prijmeni, "email": email}
        info.append(student_info)

    return info


# Asi není potřeba - pouze pro to, kdyby mohl učitel vypisovat pouze na svoje předměty
def get_ucitel_predmety(ticket, ucitIdno):
    """
     Vrati predmety, ktere ucitel vyucuje
    """
    try:
        url = "ws/services/rest2/predmety/getPredmetyByUcitel"
        params = {
            "ucitIdno": ucitIdno,
        }
        return get(ticket, url, params)
    except:
        return internal_server_error

def get_studenti_na_predmetu(ticket, katedra, zkratka_predmetu):
    """ Získá F čísla všech studentů, kteří jsou zapsáni na předmětu """
    url = os.getenv("STAG_URL") + "/services/rest2/student/getStudentiByPredmet"
    params = {
        "zkratka": zkratka_predmetu,
        "katedra": katedra, 
    }
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive",
        "Accept-Origin": os.getenv("STAG_URL"),
    }
    try:
        response = requests.get(url, params=params, headers=headers, cookies={'WSCOOKIE': ticket})
        response = response.json()["studentPredmetu"]
        osobni_cisla = []
    # print(response)
        for student in response:
            osobni_cisla.append(student["osCislo"])

        return osobni_cisla

    except:
        return internal_server_error

def compare_encoded(hash_studentu_na_terminu, studenti_na_predmetu):
    """ Vrátí nekódované Fčísla studentů, bere argument hashovaných Fčísel studentů, které porovná se všemi zapsanými studenty na předmětu """

    hash_studenti_na_predmetu = []
    for student in studenti_na_predmetu:
        student = student
        hash_studenti_na_predmetu.append(hashlib.sha1(student.encode()).hexdigest())


    matching = find_matching_hash_positions(hash_studenti_na_predmetu, hash_studentu_na_terminu)

    osobni_cisla = []
    for match in matching:
        osobni_cisla.append(studenti_na_predmetu[match])

# return osobni_cisla misto matching
    return osobni_cisla


def find_matching_hash_positions(big_list, small_list):
    matching_positions = []

    for small_hash in small_list:
        if small_hash in big_list:
            big_list_index = big_list.index(small_hash)
            matching_positions.append(big_list_index)

    return matching_positions