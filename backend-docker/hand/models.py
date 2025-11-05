from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from hand import db,login_manager

@login_manager.user_loader
def load_user(user_id):
    print("Loading user with ID:", user_id)
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    #hand = db.relationship('HandOver',backref='hand', lazy=True,overlaps="tasks")
    tasks = db.relationship('HandOver', back_populates='user', lazy=True)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}')"



class HandOver(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    username = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False, default="N/A")
    task_handled = db.Column(db.Text, nullable=False)
    task_status = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    #user = db.relationship('User', backref='tasks', lazy=True,overlaps="hand") 
    user = db.relationship('User', back_populates='tasks', lazy=True) 

    def __repr__(self):
        return f"HandOver('{self.username}', '{self.task_handled}','{self.date_created}')"
