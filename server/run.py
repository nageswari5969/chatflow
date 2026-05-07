from gevent import monkey
monkey.patch_all()

from app import create_app
from app.extensions import socketio
import os

app = create_app()

if __name__ == '__main__':
    from gevent.pywsgi import WSGIServer
    from geventwebsocket.handler import WebSocketHandler

    port = int(os.environ.get('PORT', 5000))
    print(f"Starting server on port {port}")
    server = WSGIServer(('0.0.0.0', port), app, handler_class=WebSocketHandler)
    server.serve_forever()
