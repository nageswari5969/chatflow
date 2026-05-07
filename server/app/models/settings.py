from datetime import datetime
from bson import ObjectId
from ..extensions import mongo

def get_or_create_settings(user_id):
    s = mongo.db.settings.find_one({'userId': ObjectId(user_id)})
    if not s:
        s = {
            'userId': ObjectId(user_id),
            'notifications': True,
            'sounds': True,
            'theme': 'dark',
            'language': 'en',
            'readReceipts': True,
            'lastSeenVisible': True,
            'updatedAt': datetime.utcnow(),
        }
        result = mongo.db.settings.insert_one(s)
        s['_id'] = result.inserted_id
    return s

def serialize_settings(s):
    if not s:
        return None
    return {
        '_id': str(s['_id']),
        'notifications': s.get('notifications', True),
        'sounds': s.get('sounds', True),
        'theme': s.get('theme', 'dark'),
        'language': s.get('language', 'en'),
        'readReceipts': s.get('readReceipts', True),
        'lastSeenVisible': s.get('lastSeenVisible', True),
    }
