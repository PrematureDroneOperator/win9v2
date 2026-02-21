import os
from typing import Any

from fastapi import Response


def _env_flag(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


ACCESS_COOKIE_NAME = os.getenv("AUTH_ACCESS_COOKIE_NAME", "roadchal_access_token")
REFRESH_COOKIE_NAME = os.getenv("AUTH_REFRESH_COOKIE_NAME", "roadchal_refresh_token")
COOKIE_DOMAIN = os.getenv("AUTH_COOKIE_DOMAIN") or None
COOKIE_PATH = os.getenv("AUTH_COOKIE_PATH", "/")
COOKIE_SAMESITE = os.getenv("AUTH_COOKIE_SAMESITE", "lax").lower()
if COOKIE_SAMESITE not in {"lax", "strict", "none"}:
    COOKIE_SAMESITE = "lax"
COOKIE_SECURE = _env_flag("AUTH_COOKIE_SECURE", False) or COOKIE_SAMESITE == "none"
REFRESH_COOKIE_MAX_AGE = int(os.getenv("AUTH_REFRESH_COOKIE_MAX_AGE", str(60 * 60 * 24 * 30)))


def set_auth_cookies(response: Response, session: Any) -> None:
    access_token = getattr(session, "access_token", None)
    refresh_token = getattr(session, "refresh_token", None)
    expires_in = getattr(session, "expires_in", None)

    if access_token:
        response.set_cookie(
            key=ACCESS_COOKIE_NAME,
            value=access_token,
            httponly=True,
            secure=COOKIE_SECURE,
            samesite=COOKIE_SAMESITE,
            max_age=int(expires_in) if expires_in else 3600,
            path=COOKIE_PATH,
            domain=COOKIE_DOMAIN,
        )

    if refresh_token:
        response.set_cookie(
            key=REFRESH_COOKIE_NAME,
            value=refresh_token,
            httponly=True,
            secure=COOKIE_SECURE,
            samesite=COOKIE_SAMESITE,
            max_age=REFRESH_COOKIE_MAX_AGE,
            path=COOKIE_PATH,
            domain=COOKIE_DOMAIN,
        )
