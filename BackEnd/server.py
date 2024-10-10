import uvicorn
from fastapi import FastAPI # type: ignore
from classes.server_utils import *

from endpoints.setup import router as kontrola_s_db
from endpoints.ucitel.setup_ucitel import router as setup_ucitel
from endpoints.student.home import router as student_home
from endpoints.student.zapsat_se import router as student_zapis
from endpoints.student.moje import router as student_moje
from endpoints.student.profil import router as student_profil
from endpoints.predmety import router as predmety
from endpoints.admin.nadchazejici import router as admin_nadchazejici
from endpoints.admin.board import router as admin_board
from endpoints.ucitel.home import router as ucitel_home
from endpoints.ucitel.moje import router as ucitel_moje
from endpoints.ucitel.termin.termin_info import router as ucitel_termin_info
from endpoints.ucitel.board_by_predmet import router as ucitel_board_by_predmet
from endpoints.ucitel.termin.termin_vytvor import router as ucitel_termin_vytvor
from endpoints.ucitel.termin.termin_zmena import router as ucitel_termin_zmena
from endpoints.ucitel.termin.termin_smazat import router as ucitel_termin_smazat
from endpoints.ucitel.student.studenti import router as ucitel_studenti
from endpoints.ucitel.student.student_info import router as ucitel_student_info
from endpoints.ucitel.student.student_splnit import router as ucitel_student_splnit
from endpoints.ucitel.student.student_uznat import router as ucitel_student_uznat
from endpoints.ucitel.emaily import router as ucitel_emaily
from endpoints.ucitel.student.uspesni_studenti import router as ucitel_uspesni_studenti
from endpoints.admin.pridat_predmet import router as admin_pridat_predmet
from endpoints.invalidate import router as invalidate


dotenv.load_dotenv()

app = FastAPI(debug=True)


app.include_router(kontrola_s_db)
app.include_router(setup_ucitel)
app.include_router(predmety)
app.include_router(invalidate)


# Student Endpoints
app.include_router(student_home)
app.include_router(student_zapis)
app.include_router(student_moje)
app.include_router(student_profil)


# Ucitel Endpoints
app.include_router(ucitel_home)
app.include_router(ucitel_moje)
app.include_router(ucitel_termin_info)
app.include_router(ucitel_board_by_predmet)
app.include_router(ucitel_termin_vytvor)
app.include_router(ucitel_termin_zmena)
app.include_router(ucitel_termin_smazat)
app.include_router(ucitel_studenti)
app.include_router(ucitel_student_info)
app.include_router(ucitel_student_splnit)
app.include_router(ucitel_student_uznat)
app.include_router(ucitel_emaily)
app.include_router(ucitel_uspesni_studenti)


# Admin Endpoints
app.include_router(admin_nadchazejici)
app.include_router(admin_board)
app.include_router(admin_pridat_predmet)


if __name__ == "__main__":
    dotenv.load_dotenv()

    if session:
        print("Session successfully created!")
    else:
        raise Exception("Session creation failed!")
    vyucujici_k_predmetum_to_txt(session)

    uvicorn.run(app, host=os.getenv('HOST'), port=int(os.getenv('PORT'))) # type: ignore

