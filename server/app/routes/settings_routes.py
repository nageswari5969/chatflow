from flask import Blueprint, request, g
from datetime import datetime
from ..utils.response_helper import success, error
from ..utils.decorators import require_auth
from ..models.settings import get_or_create_settings, serialize_settings
from ..extensions import mongo

settings_bp = Blueprint('settings', __name__)


@settings_bp.route('', methods=['GET'])
@require_auth
def get_settings():
    s = get_or_create_settings(str(g.user['_id']))
    return success(serialize_settings(s))


@settings_bp.route('', methods=['PUT'])
@require_auth
def update_settings():
    data = request.get_json() or {}
    allowed = ['notifications', 'sounds', 'theme', 'language', 'readReceipts', 'lastSeenVisible']
    update = {k: v for k, v in data.items() if k in allowed}
    if not update:
        return error("No valid fields")
    update['updatedAt'] = datetime.utcnow()
    mongo.db.settings.update_one(
        {'userId': g.user['_id']},
        {'$set': update},
        upsert=True
    )
    s = get_or_create_settings(str(g.user['_id']))
    return success(serialize_settings(s))
