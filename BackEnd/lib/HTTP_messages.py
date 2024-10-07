from fastapi.responses import JSONResponse # type: ignore
ok = JSONResponse(status_code=200, content={"message": 'OK'})
bad_request = JSONResponse(status_code=400, content={"message": 'Bad Request'})
unauthorized = JSONResponse(status_code=401, content={"message": 'Unauthorized'})
not_found = JSONResponse(status_code=404, content={"message": 'Not Found'})
conflict = JSONResponse(status_code=409, content={"message": 'Conflict'})
internal_server_error = JSONResponse(status_code=500, content={"message": 'Internal Server Error'})