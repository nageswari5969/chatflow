from flask_socketio import emit, join_room, disconnect
from flask import request
from ..extensions import mongo
from ..utils.jwt_helper import verify_clerk_token
from ..models.user import get_user_by_clerk_id
from datetime import datetime

# Map socket_id -> user_id string
connected_users = {}


def get_user_from_token(token):
    if not token:
        return None
    payload = verify_clerk_token(token)
    if not payload:
        return None
    clerk_id = payload.get('sub')
    return get_user_by_clerk_id(clerk_id)


def register_presence_events(socketio):

    @socketio.on('connect')
    def on_connect(auth):
        token = (auth or {}).get('token')
        user = get_user_from_token(token)
        if not user:
            disconnect()
            return

        user_id = str(user['_id'])
        connected_users[request.sid] = user_id

        # Join personal room for direct messages
        join_room(user_id)

        # Mark online
        mongo.db.users.update_one(
            {'_id': user['_id']},
            {'$set': {'online': True, 'lastSeen': datetime.utcnow()}}
        )

        # Broadcast online status
        emit('user:online', {'userId': user_id}, broadcast=True, include_self=False)

    @socketio.on('disconnect')
    def on_disconnect():
        user_id = connected_users.pop(request.sid, None)
        if not user_id:
            return

        # Only mark offline if no other sessions active for this user
        still_connected = user_id in connected_users.values()
        if not still_connected:
            from bson import ObjectId
            mongo.db.users.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'online': False, 'lastSeen': datetime.utcnow()}}
            )
            emit('user:offline', {'userId': user_id}, broadcast=True, include_self=False)
