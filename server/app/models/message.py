from datetime import datetime
from bson import ObjectId
from ..extensions import mongo
from .user import serialize_user, get_user_by_id

def create_message(chat_id, sender_id, content, msg_type='text'):
    msg = {
        'chatId': ObjectId(chat_id),
        'sender': ObjectId(sender_id),
        'content': content,
        'type': msg_type,
        'status': 'sent',
        'readBy': [ObjectId(sender_id)],
        'deleted': False,
        'createdAt': datetime.utcnow(),
        'updatedAt': datetime.utcnow(),
    }
    result = mongo.db.messages.insert_one(msg)
    msg['_id'] = result.inserted_id
    return msg

def serialize_message(msg):
    if not msg:
        return None
    sender = get_user_by_id(str(msg['sender'])) if msg.get('sender') else None
    return {
        '_id': str(msg['_id']),
        'chatId': str(msg.get('chatId', '')),
        'sender': {
            '_id': str(sender['_id']) if sender else '',
            'clerkId': sender.get('clerkId', '') if sender else '',
            'name': sender.get('name', '') if sender else '',
            'imageUrl': sender.get('imageUrl', '') if sender else '',
        } if sender else None,
        'content': msg.get('content', ''),
        'type': msg.get('type', 'text'),
        'status': msg.get('status', 'sent'),
        'deleted': msg.get('deleted', False),
        'createdAt': msg['createdAt'].isoformat() if msg.get('createdAt') else '',
    }
