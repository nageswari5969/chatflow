from flask import Blueprint, request, g
from bson import ObjectId
from ..utils.response_helper import success, error
from ..utils.decorators import require_auth
from ..models.user import serialize_user
from ..extensions import mongo
from datetime import datetime

user_bp = Blueprint('users', __name__)


@user_bp.route('/search', methods=['GET'])
@require_auth
def search_users():
    q = request.args.get('q', '').strip()
    if not q:
        return success([])
    regex = {'$regex': q, '$options': 'i'}
    users = list(mongo.db.users.find({
        '$or': [{'name': regex}, {'email': regex}],
        '_id': {'$ne': g.user['_id']},
        'banned': {'$ne': True},
    }).limit(20))
    return success([serialize_user(u) for u in users])


@user_bp.route('/online', methods=['GET'])
@require_auth
def get_online_users():
    users = list(mongo.db.users.find({'online': True, '_id': {'$ne': g.user['_id']}}).limit(50))
    return success([serialize_user(u) for u in users])


@user_bp.route('/<user_id>', methods=['GET'])
@require_auth
def get_user(user_id):
    try:
        user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    except Exception:
        return error("Invalid user id", 400)
    if not user:
        return error("User not found", 404)
    return success(serialize_user(user))


@user_bp.route('/profile', methods=['PUT'])
@require_auth
def update_profile():
    data = request.get_json() or {}
    allowed = ['name', 'imageUrl', 'bio']
    update = {k: v for k, v in data.items() if k in allowed}
    if not update:
        return error("No valid fields to update")
    update['updatedAt'] = datetime.utcnow()
    mongo.db.users.update_one({'_id': g.user['_id']}, {'$set': update})
    user = mongo.db.users.find_one({'_id': g.user['_id']})
    return success(serialize_user(user, full=True))


@user_bp.route('/<user_id>/block', methods=['POST'])
@require_auth
def block_user(user_id):
    try:
        uid = ObjectId(user_id)
    except Exception:
        return error("Invalid user id", 400)
    mongo.db.users.update_one(
        {'_id': g.user['_id']},
        {'$addToSet': {'blockedUsers': uid}}
    )
    return success(None, "User blocked")


@user_bp.route('/<user_id>/block', methods=['DELETE'])
@require_auth
def unblock_user(user_id):
    try:
        uid = ObjectId(user_id)
    except Exception:
        return error("Invalid user id", 400)
    mongo.db.users.update_one(
        {'_id': g.user['_id']},
        {'$pull': {'blockedUsers': uid}}
    )
    return success(None, "User unblocked")
