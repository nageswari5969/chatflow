from flask_socketio import emit
from flask import request
from .presence_socket import connected_users


def register_chat_events(socketio):

    @socketio.on('message:read')
    def on_message_read(data):
        """Notify sender that their message was read."""
        user_id = connected_users.get(request.sid)
        if not user_id:
            return
        chat_id = data.get('chatId')
        sender_id = data.get('senderId')
        if sender_id:
            emit('message:read', {'chatId': chat_id, 'readBy': user_id}, room=sender_id)

    @socketio.on('message:delete')
    def on_message_delete(data):
        """Broadcast message deletion."""
        user_id = connected_users.get(request.sid)
        if not user_id:
            return
        chat_id = data.get('chatId')
        message_id = data.get('messageId')
        other_user_id = data.get('otherUserId')
        if other_user_id:
            emit('message:delete', {'chatId': chat_id, 'messageId': message_id}, room=other_user_id)
