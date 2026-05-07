from flask_socketio import emit
from flask import request
from .presence_socket import connected_users
from ..extensions import mongo
from ..models.call import create_call, serialize_call
from bson import ObjectId
from datetime import datetime


def register_call_events(socketio):

    @socketio.on('call:start')
    def on_call_start(data):
        caller_id = connected_users.get(request.sid)
        if not caller_id:
            return
        receiver_id = data.get('userId')
        call_type = data.get('type', 'voice')

        # Persist call record
        call = create_call(caller_id, receiver_id, call_type)

        # Get caller info
        from bson import ObjectId
        caller = mongo.db.users.find_one({'_id': ObjectId(caller_id)})
        from ..models.user import serialize_user

        # Notify receiver
        emit('call:incoming', {
            '_id': str(call['_id']),
            'caller': serialize_user(caller),
            'type': call_type,
        }, room=receiver_id)

    @socketio.on('call:accept')
    def on_call_accept(data):
        user_id = connected_users.get(request.sid)
        if not user_id:
            return
        call_id = data.get('callId')
        try:
            cid = ObjectId(call_id)
            mongo.db.calls.update_one(
                {'_id': cid},
                {'$set': {'status': 'answered', 'startedAt': datetime.utcnow()}}
            )
            call = mongo.db.calls.find_one({'_id': cid})
            if call:
                caller_id = str(call['caller'])
                emit('call:accepted', {'callId': call_id}, room=caller_id)
        except Exception:
            pass

    @socketio.on('call:reject')
    def on_call_reject(data):
        user_id = connected_users.get(request.sid)
        if not user_id:
            return
        call_id = data.get('callId')
        try:
            cid = ObjectId(call_id)
            mongo.db.calls.update_one({'_id': cid}, {'$set': {'status': 'rejected'}})
            call = mongo.db.calls.find_one({'_id': cid})
            if call:
                caller_id = str(call['caller'])
                emit('call:rejected', {'callId': call_id}, room=caller_id)
        except Exception:
            pass

    @socketio.on('call:end')
    def on_call_end(data):
        user_id = connected_users.get(request.sid)
        if not user_id:
            return
        call_id = data.get('callId')
        try:
            cid = ObjectId(call_id)
            call = mongo.db.calls.find_one({'_id': cid})
            if call:
                started = call.get('startedAt')
                duration = int((datetime.utcnow() - started).total_seconds()) if started else 0
                mongo.db.calls.update_one(
                    {'_id': cid},
                    {'$set': {'status': 'ended', 'endedAt': datetime.utcnow(), 'duration': duration}}
                )
                # Notify both parties
                for pid in [str(call['caller']), str(call['receiver'])]:
                    if pid != user_id:
                        emit('call:end', {'callId': call_id}, room=pid)
        except Exception:
            pass

    @socketio.on('call:signal')
    def on_call_signal(data):
        """WebRTC signaling relay (SDP / ICE candidates)."""
        user_id = connected_users.get(request.sid)
        if not user_id:
            return
        target_id = data.get('targetId')
        if target_id:
            emit('call:signal', {'from': user_id, 'signal': data.get('signal')}, room=target_id)
