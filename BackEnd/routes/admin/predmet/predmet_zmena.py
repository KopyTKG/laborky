from fastapi import APIRouter
from classes.server_utils import *
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter()


@router.patch("/admin/predmet")
async def update_predmet(ticket: str, zkratka_predmetu: str, katedra: str):
    pass