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
    ticket = "6be64e1499a966ef85538ef7f5bfdebe353838550a17e49f001ac0e46a384f24"
    token = GetStagUser(ticket)
    user = "F22118"
    print(token)
    url = "https://ws.ujep.cz/ws/services/rest2/rozvrhy/getRozvrhByKatedra?stagUser=" + ticket + "&semestr=ZS&katedra=KI"
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Connection": "keep-alive",
        "Accept-Origin": "https://ws.ujep.cz",
    }
    response = requests.get(url, headers=headers)
    print(url)
    print(str(response.headers))
    return GetStagUser(ticket)



app.run(host=os.getenv('HOST'), port=os.getenv('PORT'))
