import hashlib

def predmety_pro_cviceni():  
    return ["PCA", "ZPS", "ZEL"] # Funkce na vrácení předmětů, které budeme trackovat

def encode_id(id):
    return hashlib.sha1(id.encode()).hexdigest()