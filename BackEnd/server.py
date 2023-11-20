from flask import Flask
import dotenv, os, requests, json

dotenv.load_dotenv();

app = Flask(__name__)

def GetStagUser(Ticket):
    url = "https://ws.ujep.cz/ws/services/rest2/help/getStagUserListForLoginTicketV2?ticket=" + Ticket
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive",
    }
    response = requests.get(url, headers=headers)
    print(response)
    return str(response.json())


@app.get("/test")
def TestRequest():
    ticket = "762f667590053e32ae2e528906ed59141a0bae39985e5f985a5b656a9b20cb8a"
    # token = GetStagUser(ticket)
    user = "F22118"
    # print(token)
    
    url = "https://ws.ujep.cz/ws/services/rest2/rozvrhy/getRozvrhByKatedra?stagUser=F22118&semestr=ZS&katedra=KI"
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive",
        "Accept-Origin": "https://ws.ujep.cz",
    }
    response = requests.get(url, headers=headers)
    print(url)
    print(str(response.headers))
    return 'success', 200




if __name__ == "__main__":
    # app.run(host=os.getenv('HOST'), port=os.getenv('PORT'))
    url = "https://ws.ujep.cz/ws/services/rest2/rozvrhy/getRozvrhByKatedra"
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive", 
        "Accept-Origin": "https://ws.ujep.cz",
    }
    params = {
        'semestr': 'ZS',
        'katedra': 'KI',
    }
    ticket = '530fd05809a860ff21e8e6a57d96e1869c9eb72659608d34c9f5f929350ca8f2'
    response = requests.get(url, params=params, headers=headers, cookies={'WSCOOKIE': ticket})
    print(response.json())