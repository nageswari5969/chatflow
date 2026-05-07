from flask import Blueprint, request, g
from bson import ObjectId
from datetime import datetime
from ..utils.response_helper import success, error
from ..utils.decorators import require_auth
from ..models.group import create_group, serialize_group
from ..models.message import create_message, serialize_message
from ..extensions import mongo, socketio

group_bp = Blueprint('groups', __name__)


@group_bp.route('', methods=['GET'])
@require_auth
def get_groups():
    groups = list(mongo.db.groups.find(
        {'members': g.user['_id']}
    ).sort('updatedAt', -1))
    return success([serialize_group(gr) for gr in groups])


@group_bp.route('', methods=['POST'])
@require_auth
def create_group_route():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    description = data.get('description', '')
    member_ids = data.get('memberIds', [])
    if not name:
        return error("Group name required")
    group = create_group(name, description, str(g.user['_id']), member_ids)
    return success(serialize_group(group, include_members=True), status=201)


@group_bp.route('/<group_id>', methods=['GET'])
@require_auth
def get_group(group_id):
    try:
        gid = ObjectId(group_id)
    except Exception:
        return error("Invalid group id", 400)
    group = mongo.db.groups.find_one({'_id': gid, 'members': g.user['_id']})
    if not group:
        return error("Group not found", 404)
    return success(serialize_group(group, include_members=True))


@group_bp.route('/<group_id>', methods=['PUT'])
@require_auth
def update_group(group_id):
    try:
        gid = ObjectId(group_id)
    except Exception:
        return error("Invalid group id", 400)
    group = mongo.db.groups.find_one({'_id': gid, 'admin': g.user['_id']})
    if not group:
        return error("Group not found or not admin", 404)
    data = request.get_json() or {}
    update = {}
    if 'name' in data:
        update['name'] = data['name']
    if 'description' in data:
        update['description'] = data['description']
    update['updatedAt'] = datetime.utcnow()
    mongo.db.groups.update_one({'_id': gid}, {'$set': update})
    group = mongo.db.groups.find_one({'_id': gid})
    return success(serialize_group(group))


@group_bp.route('/<group_id>', methods=['DELETE'])
@require_auth
def delete_group(group_id):
    try:
        gid = ObjectId(group_id)
    except Exception:
        return error("Invalid group id", 400)
    group = mongo.db.groups.find_one({'_id': gid, 'admin': g.user['_id']})
    if not group:
        return error("Group not found or not admin", 404)
    mongo.db.groups.delete_one({'_id': gid})
    mongo.db.messages.delete_many({'chatId': gid})
    return success(None, "Group deleted")


@group_bp.route('/<group_id>/messages', methods=['GET'])
@require_auth
def get_group_messages(group_id):
    try:
        gid = ObjectId(group_id)
    except Exception:
        return error("Invalid group id", 400)
    group = mongo.db.groups.find_one({'_id': gid, 'members': g.user['_id']})
    if not group:
        return error("Group not found", 404)
    page = int(request.args.get('page', 1))
    skip = (page - 1) * 50
    messages = list(mongo.db.messages.find(
        {'chatId': gid, 'deleted': {'$ne': True}}
    ).sort('createdAt', 1).skip(skip).limit(50))
    return success([serialize_message(m) for m in messages])


@group_bp.route('/<group_id>/messages', methods=['POST'])
@require_auth
def send_group_message(group_id):
    try:
        gid = ObjectId(group_id)
    except Exception:
        return error("Invalid group id", 400)
    group = mongo.db.groups.find_one({'_id': gid, 'members': g.user['_id']})
    if not group:
        return error("Group not found", 404)
    data = request.get_json() or {}
    content = data.get('content', '').strip()
    if not content:
        return error("Content required")
    msg = create_message(group_id, str(g.user['_id']), content, data.get('type', 'text'))
    serialized = serialize_message(msg)
    # Update lastMessage
    mongo.db.groups.update_one({'_id': gid}, {'$set': {'lastMessage': msg, 'updatedAt': datetime.utcnow()}})
    # Emit to all members
    for mid in group.get('members', []):
        if str(mid) != str(g.user['_id']):
            socketio.emit('group:message', {'groupId': group_id, 'message': serialized}, room=str(mid))
    return success(serialized, status=201)


@group_bp.route('/<group_id>/members', methods=['POST'])
@require_auth
def add_members(group_id):
    try:
        gid = ObjectId(group_id)
    except Exception:
        return error("Invalid group id", 400)
    group = mongo.db.groups.find_one({'_id': gid, 'admin': g.user['_id']})
    if not group:
        return error("Group not found or not admin", 404)
    data = request.get_json() or {}
    user_ids = [ObjectId(uid) for uid in data.get('userIds', [])]
    mongo.db.groups.update_one({'_id': gid}, {'$addToSet': {'members': {'$each': user_ids}}})
    return success(None, "Members added")


@group_bp.route('/<group_id>/members/<user_id>', methods=['DELETE'])
@require_auth
def remove_member(group_id, user_id):
    try:
        gid = ObjectId(group_id)
        uid = ObjectId(user_id)
    except Exception:
        return error("Invalid id", 400)
    group = mongo.db.groups.find_one({'_id': gid, 'admin': g.user['_id']})
    if not group:
        return error("Group not found or not admin", 404)
    mongo.db.groups.update_one({'_id': gid}, {'$pull': {'members': uid}})
    return success(None, "Member removed")


@group_bp.route('/<group_id>/leave', methods=['POST'])
@require_auth
def leave_group(group_id):
    try:
        gid = ObjectId(group_id)
    except Exception:
        return error("Invalid group id", 400)
    mongo.db.groups.update_one({'_id': gid}, {'$pull': {'members': g.user['_id']}})
    return success(None, "Left group")
