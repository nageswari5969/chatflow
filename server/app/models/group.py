from datetime import datetime
from bson import ObjectId
from ..extensions import mongo
from .user import serialize_user, get_user_by_id

def create_group(name, description, admin_id, member_ids):
    all_members = list(set([str(admin_id)] + [str(m) for m in member_ids]))
    group = {
        'name': name,
        'description': description,
        'admin': ObjectId(admin_id),
        'members': [ObjectId(m) for m in all_members],
        'imageUrl': '',
        'lastMessage': None,
        'createdAt': datetime.utcnow(),
        'updatedAt': datetime.utcnow(),
    }
    result = mongo.db.groups.insert_one(group)
    group['_id'] = result.inserted_id
    return group

def serialize_group(group, include_members=False):
    if not group:
        return None
    data = {
        '_id': str(group['_id']),
        'name': group.get('name', ''),
        'description': group.get('description', ''),
        'imageUrl': group.get('imageUrl', ''),
        'admin': str(group.get('admin', '')),
        'memberCount': len(group.get('members', [])),
        'createdAt': group['createdAt'].isoformat() if group.get('createdAt') else '',
    }
    if include_members:
        members = []
        for mid in group.get('members', []):
            u = get_user_by_id(str(mid))
            if u:
                members.append(serialize_user(u))
        data['members'] = members
    else:
        data['members'] = [str(m) for m in group.get('members', [])]
    return data
