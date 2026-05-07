from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import mongo, socketio

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app,
         origins=["http://localhost:3000", "http://127.0.0.1:3000"],
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    mongo.init_app(app)
    socketio.init_app(app,
        async_mode='gevent',
        cors_allowed_origins="*",
        logger=False,
        engineio_logger=False
    )

    from .routes.auth_routes import auth_bp
    from .routes.user_routes import user_bp
    from .routes.chat_routes import chat_bp
    from .routes.group_routes import group_bp
    from .routes.call_routes import call_bp
    from .routes.notification_routes import notification_bp
    from .routes.settings_routes import settings_bp
    from .routes.admin_routes import admin_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(chat_bp, url_prefix='/api/chats')
    app.register_blueprint(group_bp, url_prefix='/api/groups')
    app.register_blueprint(call_bp, url_prefix='/api/calls')
    app.register_blueprint(notification_bp, url_prefix='/api/notifications')
    app.register_blueprint(settings_bp, url_prefix='/api/settings')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    from .sockets import register_sockets
    register_sockets(socketio)

    return app
