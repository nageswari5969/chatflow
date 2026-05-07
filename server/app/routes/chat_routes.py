from flask import Blueprint, request, g
from bson import ObjectId
from datetime import datetime
from ..utils.response_helper import success, error
from ..utils.decorators import require_auth
from ..models.message import create_message, serialize_message
from ..models.user import serialize_user, get_user_by_id
from ..extensions import mongo, socketio
from ..utils.constants import MESSAGE_TYPES

chat_bp = Blueprint('chats', __name__)


def get_or_create_conversation(user1_id, user2_id):
    u1, u2 = ObjectId(user1_id), ObjectId(user2_id)
    chat = mongo.db.chats.find_one({
        'type': 'direct',
        'participants': {'$all': [u1, u2], '$size': 2}
    })
    if not chat:
        chat = {
            'type': 'direct',
            'participants': [u1, u2],
            'lastMessage': None,
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow(),
        }
        result = mongo.db.chats.insert_one(chat)
        chat['_id'] = result.inserted_id
    return chat


def serialize_chat(chat, current_user_id):
    other_id = next(
        (str(p) for p in chat.get('participants', []) if str(p) != str(current_user_id)),
        None
    )
    other_user = get_user_by_id(other_id) if other_id else None
    last_msg = chat.get('lastMessage')
    unread = mongo.db.messages.count_documents({
        'chatId': chat['_id'],
        'readBy': {'$nin': [ObjectId(current_user_id)]},
        'sender': {'$ne': ObjectId(current_user_id)},
    })
    return {
        '_id': str(chat['_id']),
        'type': chat.get('type', 'direct'),
        'otherUser': serialize_user(other_user) if other_user else None,
        'lastMessage': serialize_message(last_msg) if isinstance(last_msg, dict) and last_msg.get('_id') else None,
        'unreadCount': unread,
        'updatedAt': chat['updatedAt'].isoformat() if chat.get('updatedAt') else '',
    }


@chat_bp.route('', methods=['GET'])
@require_auth
def get_conversations():
    uid = g.user['_id']
    chats = list(mongo.db.chats.find(
        {'participants': uid, 'type': 'direct'}
    ).sort('updatedAt', -1))
    return success([serialize_chat(c, uid) for c in chats])


@chat_bp.route('', methods=['POST'])
@require_auth
def create_conversation():
    data = request.get_json() or {}
    user_id = data.get('userId')
    if not user_id:
        return error("userId required")
    try:
        chat = get_or_create_conversation(str(g.user['_id']), user_id)
    except Exception as e:
        return error(str(e))
    return success(serialize_chat(chat, g.user['_id']), status=201)


@chat_bp.route('/<chat_id>/messages', methods=['GET'])
@require_auth
def get_messages(chat_id):
    try:
        cid = ObjectId(chat_id)
    except Exception:
        return error("Invalid chat id", 400)
    page = int(request.args.get('page', 1))
    limit = 50
    skip = (page - 1) * limit
    messages = list(mongo.db.messages.find(
        {'chatId': cid, 'deleted': {'$ne': True}}
    ).sort('createdAt', 1).skip(skip).limit(limit))
    return success([serialize_message(m) for m in messages])


@chat_bp.route('/<chat_id>/messages', methods=['POST'])
@require_auth
def send_message(chat_id):
    data = request.get_json() or {}
    content = data.get('content', '').strip()
    msg_type = data.get('type', 'text')
    if not content:
        return error("Message content required")
    if msg_type not in MESSAGE_TYPES:
        return error("Invalid message type")
    try:
        cid = ObjectId(chat_id)
    except Exception:
        return error("Invalid chat id", 400)

    # Verify user is participant
    chat = mongo.db.chats.find_one({'_id': cid, 'participants': g.user['_id']})
    if not chat:
        return error("Conversation not found", 404)

    msg = create_message(chat_id, str(g.user['_id']), content, msg_type)
    serialized = serialize_message(msg)

    # Update chat's lastMessage
    mongo.db.chats.update_one(
        {'_id': cid},
        {'$set': {'lastMessage': msg, 'updatedAt': datetime.utcnow()}}
    )

    # Emit to other participants via socket
    for pid in chat.get('participants', []):
        if str(pid) != str(g.user['_id']):
            socketio.emit('message:receive', {
                'chatId': chat_id,
                'message': serialized,
            }, room=str(pid))

    return success(serialized, status=201)


@chat_bp.route('/<chat_id>/read', methods=['PUT'])
@require_auth
def mark_read(chat_id):
    try:
        cid = ObjectId(chat_id)
    except Exception:
        return error("Invalid chat id", 400)
    mongo.db.messages.update_many(
        {'chatId': cid, 'readBy': {'$nin': [g.user['_id']]}},
        {'$addToSet': {'readBy': g.user['_id']}, '$set': {'status': 'read'}}
    )
    return success(None, "Marked as read")


@chat_bp.route('/<chat_id>/messages/<message_id>', methods=['DELETE'])
@require_auth
def delete_message(chat_id, message_id):
    try:
        mid = ObjectId(message_id)
    except Exception:
        return error("Invalid message id", 400)
    msg = mongo.db.messages.find_one({'_id': mid, 'sender': g.user['_id']})
    if not msg:
        return error("Message not found or not yours", 404)
    mongo.db.messages.update_one({'_id': mid}, {'$set': {'deleted': True, 'content': 'This message was deleted'}})
    return success(None, "Message deleted")


@chat_bp.route('/search', methods=['GET'])
@require_auth
def search_messages():
    q = request.args.get('q', '').strip()
    if not q:
        return success([])
    # Find chats user is in
    user_chats = [c['_id'] for c in mongo.db.chats.find({'participants': g.user['_id']})]
    messages = list(mongo.db.messages.find({
        'chatId': {'$in': user_chats},
        'content': {'$regex': q, '$options': 'i'},
        'deleted': {'$ne': True},
    }).limit(30))
    return success([serialize_message(m) for m in messages])
