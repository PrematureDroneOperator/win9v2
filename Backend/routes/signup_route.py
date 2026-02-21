from fastapi import APIRouter, Response

try:
    from ..controllers.signup_controller import signup, SignupRequest
except ImportError:
    from controllers.signup_controller import signup, SignupRequest

router = APIRouter()

@router.post("/signup")
async def signup_route(request: SignupRequest, response: Response):
    return signup(request, response)
