from hand import create_app, db
from hand.models import *  # Import all your models here

app = create_app()

with app.app_context():
    db.create_all()
    print("All tables created successfully.")
