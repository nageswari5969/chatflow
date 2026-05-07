from flask import Blueprint, request
from ..utils.response_helper import success, error
from ..models.user import create_user, get_user_by_clerk_id, serialize_user
from ..extensions import mongo
from datetime import datetime
import base64, json, os, httpx

auth_bp = Blueprint('auth', __name__)

def decode_clerk_token(token):
    try:
        payload_part = token.split('.')[1]
        padding = 4 - len(payload_part) % 4
        if padding != 4:
            payload_part += '=' * padding
        return json.loads(base64.b64decode(payload_part))
    except Exception:
        return {}

def get_clerk_user_info(clerk_user_id):
    """Fetch real user info from Clerk API."""
    try:
        secret_key = os.getenv('CLERK_SECRET_KEY', '')
        if not secret_key:
            return {}
        resp = httpx.get(
            f'https://api.clerk.com/v1/users/{clerk_user_id}',
            headers={'Authorization': f'Bearer {secret_key}'},
            timeout=5
        )
        if resp.status_code == 200:
            return resp.json()
    except Exception:
        pass
    return {}

@auth_bp.route('/sync', methods=['POST'])
def sync_user():
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return error("No token", 401)
    token = auth[7:]
    payload = decode_clerk_token(token)
    clerk_id = payload.get('sub')
    if not clerk_id:
        return error("Invalid token", 401)

    # Fetch real user info from Clerk API
    clerk_info = get_clerk_user_info(clerk_id)

    # Get real name
    first = clerk_info.get('first_name', '') or payload.get('first_name', '')
    last = clerk_info.get('last_name', '') or payload.get('last_name', '')
    name = f"{first} {last}".strip()

    # Get email
    emails = clerk_info.get('email_addresses', [])
    email = emails[0].get('email_address', '') if emails else payload.get('email', f'{clerk_id}@user.com')

    # Get profile image
    image_url = clerk_info.get('image_url', '') or clerk_info.get('profile_image_url', '')

    # If no name, use email prefix
    if not name:
        name = email.split('@')[0] if email else 'User'

    user = get_user_by_clerk_id(clerk_id)
    if not user:
        user = create_user(clerk_id, email, name, image_url)
    else:
        mongo.db.users.update_one(
            {'clerkId': clerk_id},
            {'$set': {
                'name': name,
                'email': email,
                'imageUrl': image_url,
                'updatedAt': datetime.utcnow()
            }}
        )
        user = get_user_by_clerk_id(clerk_id)

    return success(serialize_user(user, full=True), "User synced")

@auth_bp.route('/me', methods=['GET'])
def get_me():
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return error("No token", 401)
    token = auth[7:]
    payload = decode_clerk_token(token)
    clerk_id = payload.get('sub')
    if not clerk_id:
        return error("Invalid token", 401)
    user = get_user_by_clerk_id(clerk_id)
    if not user:
        return error("User not found", 404)
    return success(serialize_user(user, full=True))