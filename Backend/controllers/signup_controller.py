
try:
    from ..supabase_client import supabase
    from .auth_cookie_utils import set_auth_cookies
except ImportError:
    from supabase_client import supabase
    from controllers.auth_cookie_utils import set_auth_cookies
from pydantic import BaseModel
from fastapi import HTTPException, Response


class SignupRequest(BaseModel):
    email: str
    username: str
    password: str

def signup(request: SignupRequest, response: Response):
    try:
        res = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password,
            "options": {
                "data": {
                    "username": request.username
                }
            }
        })

        if not res.user:
            raise HTTPException(status_code=400, detail="Signup failed")

        if res.session:
            set_auth_cookies(response, res.session)

        message = (
            "Signup successful"
            if res.session
            else "Signup successful. Please verify your email to continue."
        )

        return {
            "user": res.user,
            "session": res.session,
            "message": message
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        status_code = getattr(e, "status", None) or getattr(e, "status_code", 500)
        message = getattr(e, "message", None) or str(e)
        if isinstance(status_code, int):
            raise HTTPException(status_code=status_code, detail=message)
        raise HTTPException(status_code=500, detail=message)
