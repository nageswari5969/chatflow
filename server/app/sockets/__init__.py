from .chat_socket import register_chat_events
from .presence_socket import register_presence_events
from .typing_socket import register_typing_events
from .call_socket import register_call_events


def register_sockets(socketio):
    register_presence_events(socketio)
    register_chat_events(socketio)
    register_typing_events(socketio)
    register_call_events(socketio)
