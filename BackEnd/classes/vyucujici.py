import requests

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