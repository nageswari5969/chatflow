import os
import httpx
from jose import jwt, JWTError
from flask import current_app

_jwks_cache = None

def get_jwks():
    global _jwks_cache
    if _jwks_cache:
        return _jwks_cache
    url = current_app.config.get('CLERK_JWKS_URL', '')
    if not url:
        return {}
    resp = httpx.get(url, timeout=10)
    _jwks_cache = resp.json()
    return _jwks_cache

def verify_clerk_token(token: str) -> dict | None:
    """Verify a Clerk JWT and return the payload, or None on failure."""
    try:
        jwks = get_jwks()
        # Use jose to decode with JWKS
        payload = jwt.decode(
            token,
            jwks,
            algorithms=['RS256'],
            options={"verify_aud": False}
        )
        return payload
    except (JWTError, Exception):
        return None

def extract_token(request) -> str | None:
    auth = request.headers.get('Authorization', '')
    if auth.startswith('Bearer '):
        return auth[7:]
    return None
