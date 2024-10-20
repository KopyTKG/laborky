from .nadchazejici import router as admin_nadchazejici
from .board import router as admin_board
from .predmet.predmet_vytvor import router as admin_predmet_vytvorit
from .predmet.predmet_smazat import router as admin_predmet_smazat
from .predmet.predmet_zmena import router as admin_predmet_zmena


admin_routers = [
    admin_nadchazejici,
    admin_board,
    admin_predmet_vytvorit,
    admin_predmet_smazat,
    admin_predmet_zmena
]
