from flask_socketio import emit, join_room, leave_room
from flask import request
from .presence_socket import connected_users


def register_group_events(socketio):

    @socketio.on('group:join')
    def on_group_join(data):
        group_id = data.get('groupId')
        if group_id:
            join_room(f'group_{group_id}')

    @socketio.on('group:leave')
    def on_group_leave(data):
        group_id = data.get('groupId')
        if group_id:
            leave_room(f'group_{group_id}')
