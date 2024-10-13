from fastapi import APIRouter
import requests
import os


router = APIRouter()


@router.get("/invalidate")
def invalidate(ticket: str):
    url = os.getenv("STAG_URL") + "ws/services/rest2/help/invalidateTicket?ticket=" + ticket

    response = requests.get(url)
    return 200