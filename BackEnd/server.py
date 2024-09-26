import uvicorn
from fastapi import FastAPI
from classes.stag import *
from classes.db import *
from jose import jwt
import dotenv, os, requests, json
import uvicorn


dotenv.load_dotenv()

app = FastAPI(debug=True)

@app.get("/")
async def root():
    ticket = os.getenv('TICKET')
    function = Tracked_Predmety()
    user = GetStudentPredmetyAbsolvoval(ticket, function)
    return user

if __name__ == "__main__":
    uvicorn.run(app, host=os.getenv('HOST'), port=int(os.getenv('PORT')))

    
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
