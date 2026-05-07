from datetime import datetime
from bson import ObjectId
from ..extensions import mongo
from .user import serialize_user, get_user_by_id

def create_call(caller_id, receiver_id, call_type):
    call = {
        'caller': ObjectId(caller_id),
        'receiver': ObjectId(receiver_id),
        'type': call_type,
        'status': 'ringing',
        'startedAt': None,
        'endedAt': None,
        'duration': 0,
        'createdAt': datetime.utcnow(),
    }
    result = mongo.db.calls.insert_one(call)
    call['_id'] = result.inserted_id
    return call

def serialize_call(call, current_user_id):
    if not call:
        return None
    caller_id = str(call.get('caller', ''))
    is_outgoing = caller_id == str(current_user_id)
    other_id = str(call['receiver']) if is_outgoing else caller_id
    other_user = get_user_by_id(other_id)
    return {
        '_id': str(call['_id']),
        'otherUser': serialize_user(other_user),
        'type': call.get('type', 'voice'),
        'status': call.get('status', 'missed'),
        'direction': 'outgoing' if is_outgoing else 'incoming',
        'duration': call.get('duration', 0),
        'createdAt': call['createdAt'].isoformat() if call.get('createdAt') else '',
    }
