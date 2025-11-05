from flask import Flask, jsonify,session
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager,current_user
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect
from flask_cors import CORS
from dotenv import load_dotenv
import os
from config import config
from datetime import datetime

# Load .env early
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
login_manager.login_view = 'login'
migrate = Migrate()
csrf = CSRFProtect()


@login_manager.unauthorized_handler
def unauthorized_callback():
    return jsonify({'message': 'Unauthorized'}), 401

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True, resources={r"/api/.*": {"origins": "http://localhost:5173"}})

    # Load config class based on FLASK_CONFIG
    config_name = os.getenv('FLASK_CONFIG', 'default')
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    csrf.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)

    # @app.before_request
    # def track_activity():
    #     if current_user.is_authenticated:
    #         session['last_seen'] = datetime.utcnow()
    #         session.modified = True
    @app.before_request
    def track_activity():
    if current_user.is_authenticated:
        last_seen = session.get('last_seen')
        now = datetime.utcnow()

        # Check if session has expired manually
        if last_seen and now - last_seen > timedelta(minutes=2):  # match your config
            session.clear()
            return jsonify({'message': 'Session expired'}), 401

        # Otherwise, update last_seen
        session['last_seen'] = now

    # Import routes after app is ready
    from hand.routes import init_routes
    init_routes(app)

    return app
