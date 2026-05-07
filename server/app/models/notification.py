from datetime import datetime
from bson import ObjectId
from ..extensions import mongo

def create_notification(user_id, title, body, notif_type, ref_id=None):
    notif = {
        'userId': ObjectId(user_id),
        'title': title,
        'body': body,
        'type': notif_type,
        'refId': str(ref_id) if ref_id else None,
        'read': False,
        'createdAt': datetime.utcnow(),
    }
    result = mongo.db.notifications.insert_one(notif)
    notif['_id'] = result.inserted_id
    return notif

def serialize_notification(n):
    if not n:
        return None
    return {
        '_id': str(n['_id']),
        'title': n.get('title', ''),
        'body': n.get('body', ''),
        'type': n.get('type', ''),
        'refId': n.get('refId'),
        'read': n.get('read', False),
        'createdAt': n['createdAt'].isoformat() if n.get('createdAt') else '',
    }
