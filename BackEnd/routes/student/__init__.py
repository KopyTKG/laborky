from .home import router as student_home
from .zapsat_se import router as student_zapis
from .moje import router as student_moje
from .profil import router as student_profil
from .reset import router as student_reset

student_routers = [
    student_home,
    student_zapis,
    student_moje,
    student_profil,
    student_reset
]