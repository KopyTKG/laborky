from flask import Flask
import dotenv, os

dotenv.load_dotenv();

app = Flask(__name__)

@app.get("/test")
def TestRequest():
    return 'Success', 200



app.run(host=os.getenv('HOST'), port=os.getenv('PORT'))