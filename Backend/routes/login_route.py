from fastapi import APIRouter,Response

try:
    from ..controllers.login_controller import login, LoginRequest
except ImportError:
    from controllers.login_controller import login, LoginRequest

router = APIRouter()

@router.post("/login")
async def login_route(request: LoginRequest,response: Response):
    return login(request, response)
