import requests
import hashlib

def get_student_info(ticket, osobni_cislo):
    """ Vrátí informace o studentovi podle osobního čísla """
    url = "https://stag-demo.zcu.cz/ws/services/rest2/student/getStudentInfo"
    params = {
        "osCislo": osobni_cislo,
    }
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive", 
        "Accept-Origin": "https://stag-demo.zcu.cz",
    }
    response = requests.get(url,headers=headers, params=params, cookies={'WSCOOKIE': ticket})
    if not response.ok:
        raise Exception(response.text)
    
    response = response.json()

    jmeno = response["jmeno"]
    prijmeni = response["prijmeni"]
    email = response["email"]

    return jmeno, prijmeni, email


def get_studenti_info(ticket, list_studentu):
    """ Vrátí informace o studentech podle osobního čísla """
    info = {}
    for student in list_studentu:
        jmeno, prijmeni, email = get_student_info(ticket, student)
        info[student] = {"jmeno": jmeno, "prijmeni": prijmeni, "email": email}
        
    return info


# Asi není potřeba - pouze pro to, kdyby mohl učitel vypisovat pouze na svoje předměty
def get_ucitel_predmety(ticket, ucitIdno):
    """
     Vrati predmety, ktere ucitel vyucuje 
    """

    url = "https://stag-demo.zcu.cz/ws/services/rest2/predmety/getPredmetyByUcitel"
    params = {
        "ucitIdno": ucitIdno,
    }
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive", 
        "Accept-Origin": "https://stag-demo.zcu.cz",
    }
    response = requests.get(url,headers=headers, params=params, cookies={'WSCOOKIE': ticket})
    if not response.ok:
        raise Exception(response.text)
    return response.json()


def get_studenti_na_predmetu(ticket, katedra, zkratka_predmetu):
    """ Získá F čísla všech studentů, kteří jsou zapsáni na předmětu """
    url = "https://stag-demo.zcu.cz/ws/services/rest2/student/getStudentiByPredmet"
    params = {
        "zkratka": zkratka_predmetu,
        "katedra": katedra,
    }
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive", 
        "Accept-Origin": "https://stag-demo.zcu.cz",
    }
    response = requests.get(url,headers=headers, params=params, cookies={'WSCOOKIE': ticket})
    if not response.ok:
        raise Exception(response.text)

    response = response.json()["studentPredmetu"]
    osobni_cisla = []
    for student in response:
        osobni_cisla.append(student["osCislo"])

    return osobni_cisla


def compare_encoded(hash_studentu_na_terminu, studenti_na_predmetu):
    """ Porovná zakódované osobní čísla, aby mohl učitel získat Fčíslo studentů """

    hash_studenti_na_predmetu = []
    for student in studenti_na_predmetu:
        hash_studenti_na_predmetu.append(hashlib.sha1(student.encode()).hexdigest())
    
    matching = find_matching_hash_positions(hash_studenti_na_predmetu, hash_studentu_na_terminu)

    osobni_cisla = []
    for match in matching:
        osobni_cisla.append(studenti_na_predmetu[match[1]])

    return osobni_cisla


def find_matching_hash_positions(big_list, small_list):
    matching_positions = []
    
    for i, small_hash in enumerate(small_list):
        if small_hash in big_list:
            big_list_index = big_list.index(small_hash)
            matching_positions.append((i, big_list_index))
    
    return matching_positions
