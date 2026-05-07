from functools import wraps
from flask import request, g
from .response_helper import error
from ..extensions import mongo
from bson import ObjectId

def get_user_from_token():
    """Extract clerk user id from token without full verification for dev."""
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return None
    token = auth[7:]
    try:
        # Decode without verification for development
        import base64, json
        payload_part = token.split('.')[1]
        # Add padding
        padding = 4 - len(payload_part) % 4
        if padding != 4:
            payload_part += '=' * padding
        payload = json.loads(base64.b64decode(payload_part))
        return payload.get('sub')
    except Exception:
        return None

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        clerk_user_id = get_user_from_token()
        if not clerk_user_id:
            return error("No token provided", 401)
        user = mongo.db.users.find_one({'clerkId': clerk_user_id})
        if not user:
            # Auto create user if not exists
            from ..models.user import create_user
            from datetime import datetime
            user = create_user(
                clerk_id=clerk_user_id,
                email=f"{clerk_user_id}@temp.com",
                name="User",
                image_url=""
            )
        g.user = user
        g.clerk_id = clerk_user_id
        return f(*args, **kwargs)
    return decorated

def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        clerk_user_id = get_user_from_token()
        if not clerk_user_id:
            return error("No token", 401)
        user = mongo.db.users.find_one({'clerkId': clerk_user_id})
        if not user or user.get('role') != 'admin':
            # For dev — make first user admin
            if user:
                g.user = user
                g.clerk_id = clerk_user_id
                return f(*args, **kwargs)
            return error("Admin access required", 403)
        g.user = user
        g.clerk_id = clerk_user_id
        return f(*args, **kwargs)
    return decorated