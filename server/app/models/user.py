from datetime import datetime
from bson import ObjectId
from ..extensions import mongo

def create_user(clerk_id, email, name, image_url='', role='user'):
    user = {
        'clerkId': clerk_id,
        'email': email,
        'name': name,
        'imageUrl': image_url,
        'role': role,
        'online': False,
        'lastSeen': datetime.utcnow(),
        'banned': False,
        'blockedUsers': [],
        'createdAt': datetime.utcnow(),
        'updatedAt': datetime.utcnow(),
    }
    result = mongo.db.users.insert_one(user)
    user['_id'] = result.inserted_id
    return user

def get_user_by_clerk_id(clerk_id):
    return mongo.db.users.find_one({'clerkId': clerk_id})

def get_user_by_id(user_id):
    return mongo.db.users.find_one({'_id': ObjectId(user_id)})

def serialize_user(user, full=False):
    if not user:
        return None
    data = {
        '_id': str(user['_id']),
        'name': user.get('name', ''),
        'email': user.get('email', ''),
        'imageUrl': user.get('imageUrl', ''),
        'online': user.get('online', False),
        'lastSeen': user.get('lastSeen', '').isoformat() if user.get('lastSeen') else '',
    }
    if full:
        data.update({
            'role': user.get('role', 'user'),
            'banned': user.get('banned', False),
            'createdAt': user.get('createdAt', '').isoformat() if user.get('createdAt') else '',
        })
    return data
