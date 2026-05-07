from flask import Blueprint, request, g
from bson import ObjectId
from datetime import datetime
from ..utils.response_helper import success, error
from ..utils.decorators import require_admin
from ..models.user import serialize_user
from ..models.report import serialize_report
from ..extensions import mongo

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/stats', methods=['GET'])
@require_admin
def get_stats():
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    stats = {
        'users': mongo.db.users.count_documents({}),
        'messages': mongo.db.messages.count_documents({'createdAt': {'$gte': today_start}}),
        'calls': mongo.db.calls.count_documents({'createdAt': {'$gte': today_start}}),
        'groups': mongo.db.groups.count_documents({}),
    }
    return success(stats)


@admin_bp.route('/users', methods=['GET'])
@require_admin
def get_all_users():
    users = list(mongo.db.users.find().sort('createdAt', -1).limit(200))
    return success([serialize_user(u, full=True) for u in users])


@admin_bp.route('/users/<user_id>/ban', methods=['POST'])
@require_admin
def toggle_ban(user_id):
    try:
        uid = ObjectId(user_id)
    except Exception:
        return error("Invalid user id", 400)
    user = mongo.db.users.find_one({'_id': uid})
    if not user:
        return error("User not found", 404)
    new_status = not user.get('banned', False)
    mongo.db.users.update_one({'_id': uid}, {'$set': {'banned': new_status}})
    return success({'banned': new_status}, f"User {'banned' if new_status else 'unbanned'}")


@admin_bp.route('/reports', methods=['GET'])
@require_admin
def get_reports():
    reports = list(mongo.db.reports.find().sort('createdAt', -1).limit(100))
    return success([serialize_report(r) for r in reports])


@admin_bp.route('/reports/<report_id>', methods=['PUT'])
@require_admin
def update_report(report_id):
    try:
        rid = ObjectId(report_id)
    except Exception:
        return error("Invalid report id", 400)
    data = request.get_json() or {}
    status = data.get('status')
    if status not in ['pending', 'resolved', 'dismissed']:
        return error("Invalid status")
    mongo.db.reports.update_one({'_id': rid}, {'$set': {'status': status}})
    return success(None, "Report updated")
