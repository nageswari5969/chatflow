from flask import Blueprint, g
from bson import ObjectId
from datetime import datetime
from ..utils.response_helper import success, error
from ..utils.decorators import require_auth
from ..models.notification import serialize_notification
from ..extensions import mongo

notification_bp = Blueprint('notifications', __name__)


@notification_bp.route('', methods=['GET'])
@require_auth
def get_notifications():
    notifs = list(mongo.db.notifications.find(
        {'userId': g.user['_id']}
    ).sort('createdAt', -1).limit(50))
    return success([serialize_notification(n) for n in notifs])


@notification_bp.route('/<notif_id>/read', methods=['PUT'])
@require_auth
def mark_read(notif_id):
    try:
        nid = ObjectId(notif_id)
    except Exception:
        return error("Invalid id", 400)
    mongo.db.notifications.update_one(
        {'_id': nid, 'userId': g.user['_id']},
        {'$set': {'read': True}}
    )
    return success(None, "Marked as read")


@notification_bp.route('/read-all', methods=['PUT'])
@require_auth
def mark_all_read():
    mongo.db.notifications.update_many(
        {'userId': g.user['_id'], 'read': False},
        {'$set': {'read': True}}
    )
    return success(None, "All marked as read")


@notification_bp.route('/<notif_id>', methods=['DELETE'])
@require_auth
def delete_notification(notif_id):
    try:
        nid = ObjectId(notif_id)
    except Exception:
        return error("Invalid id", 400)
    mongo.db.notifications.delete_one({'_id': nid, 'userId': g.user['_id']})
    return success(None, "Deleted")
