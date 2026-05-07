from flask import Blueprint, request, g
from bson import ObjectId
from datetime import datetime
from ..utils.response_helper import success, error
from ..utils.decorators import require_auth
from ..models.call import create_call, serialize_call
from ..extensions import mongo

call_bp = Blueprint('calls', __name__)


@call_bp.route('', methods=['GET'])
@require_auth
def get_call_history():
    uid = g.user['_id']
    calls = list(mongo.db.calls.find(
        {'$or': [{'caller': uid}, {'receiver': uid}]}
    ).sort('createdAt', -1).limit(50))
    return success([serialize_call(c, uid) for c in calls])


@call_bp.route('', methods=['POST'])
@require_auth
def initiate_call():
    data = request.get_json() or {}
    receiver_id = data.get('receiverId')
    call_type = data.get('type', 'voice')
    if not receiver_id:
        return error("receiverId required")
    call = create_call(str(g.user['_id']), receiver_id, call_type)
    return success(serialize_call(call, g.user['_id']), status=201)


@call_bp.route('/<call_id>/end', methods=['PUT'])
@require_auth
def end_call(call_id):
    try:
        cid = ObjectId(call_id)
    except Exception:
        return error("Invalid call id", 400)
    call = mongo.db.calls.find_one({'_id': cid})
    if not call:
        return error("Call not found", 404)
    started = call.get('startedAt')
    duration = int((datetime.utcnow() - started).total_seconds()) if started else 0
    mongo.db.calls.update_one(
        {'_id': cid},
        {'$set': {'status': 'ended', 'endedAt': datetime.utcnow(), 'duration': duration}}
    )
    return success(None, "Call ended")
