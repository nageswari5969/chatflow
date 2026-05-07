from flask_socketio import emit
from flask import request
from .presence_socket import connected_users


def register_typing_events(socketio):

    @socketio.on('typing:start')
    def on_typing_start(data):
        user_id = connected_users.get(request.sid)
        if not user_id:
            return
        chat_id = data.get('chatId')
        # Broadcast to the chat room (other participants joined by user_id room)
        emit('typing:start', {'chatId': chat_id, 'userId': user_id},
             broadcast=True, include_self=False)

    @socketio.on('typing:stop')
    def on_typing_stop(data):
        user_id = connected_users.get(request.sid)
        if not user_id:
            return
        chat_id = data.get('chatId')
        emit('typing:stop', {'chatId': chat_id, 'userId': user_id},
             broadcast=True, include_self=False)
