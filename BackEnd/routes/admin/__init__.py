from .nadchazejici import router as admin_nadchazejici
from .board import router as admin_board
from .pridat_predmet import router as admin_pridat_predmet

admin_routers = [
    admin_nadchazejici,
    admin_board,
    admin_pridat_predmet
]
