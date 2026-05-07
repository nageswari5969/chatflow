from datetime import datetime
from bson import ObjectId
from ..extensions import mongo
from .user import serialize_user, get_user_by_id

def create_report(reporter_id, reported_id, reason, description=''):
    report = {
        'reporter': ObjectId(reporter_id),
        'reported': ObjectId(reported_id),
        'reason': reason,
        'description': description,
        'status': 'pending',
        'createdAt': datetime.utcnow(),
    }
    result = mongo.db.reports.insert_one(report)
    report['_id'] = result.inserted_id
    return report

def serialize_report(r):
    if not r:
        return None
    reporter = get_user_by_id(str(r['reporter'])) if r.get('reporter') else None
    return {
        '_id': str(r['_id']),
        'reporter': serialize_user(reporter),
        'reported': str(r.get('reported', '')),
        'reason': r.get('reason', ''),
        'description': r.get('description', ''),
        'status': r.get('status', 'pending'),
        'createdAt': r['createdAt'].isoformat() if r.get('createdAt') else '',
    }
