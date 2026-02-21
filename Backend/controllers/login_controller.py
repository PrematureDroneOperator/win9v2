try:
    from ..supabase_client import supabase
    from .auth_cookie_utils import set_auth_cookies
except ImportError:
    from supabase_client import supabase
    from controllers.auth_cookie_utils import set_auth_cookies
from pydantic import BaseModel, EmailStr
from fastapi import HTTPException, Response


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


def login(request: LoginRequest, response: Response):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })

        if not res.user or not res.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        set_auth_cookies(response, res.session)

        return {
            "user": res.user,
            "session": res.session,
            "message": "Login successful"
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        status_code = getattr(e, "status", None) or getattr(e, "status_code", 500)
        message = getattr(e, "message", None) or str(e)

        if isinstance(status_code, int):
            raise HTTPException(status_code=status_code, detail=message)
        raise HTTPException(status_code=500, detail=message)
