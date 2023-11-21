from flask import Flask, request
from classes.stag import *
from jose import jwt
import dotenv, os, requests, json


dotenv.load_dotenv();

app = Flask(__name__)


@app.get("/test")
def TestRequest():
    return 'OK', 200

@app.route("/validate", methods=["GET"])
def ValidateUser():
    headers = request.headers
    auth = headers.get("Authorization")
    if auth:
        try: 
            res = GetStagUser(auth)
            strStag = json.dumps(res)
            token = jwt.encode(res, os.getenv('SECRET'), algorithm="HS256")
            return token
        except:
            return "Unauthorized", 401
    else:
        return "Not Acceptable", 406

if __name__ == "__main__":
    app.run(host=os.getenv('HOST'), port=os.getenv('PORT'))

    
"""
url = "https://ws.ujep.cz/ws/services/rest2/rozvrhy/getRozvrhByMistnost"
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