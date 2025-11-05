from datetime import datetime, timedelta
from flask import render_template, url_for, flash, redirect,jsonify,request,session
from flask_login import current_user, login_user, logout_user, login_required
from hand import db, bcrypt, CORS,csrf
from hand.models import User, HandOver
from hand.forms import RegistrationForm, LoginForm,TaskForm



def init_routes(app):
    @csrf.exempt
    @app.route("/api/tasks", methods=["GET",'POST'])
    @login_required
    def api_tasks():
        if request.method == "POST":
            data = request.get_json()
            try:
                start = datetime.strptime(data["start_date"], "%Y-%m-%d")
                end = datetime.strptime(data["end_date"], "%Y-%m-%d") + timedelta(days=1)

                tasks_to_display = HandOver.query.filter(
                    HandOver.date_created >= start,
                    HandOver.date_created < end
                ).order_by(HandOver.date_created.desc()).all()

            except Exception as e:
                print("Date parsing error:", e)
                return jsonify({"tasks": [], "error": "Invalid date format."}), 400

        else:
            # Default: Last 24 hours fallback
            last_24_hours = datetime.utcnow() - timedelta(hours=24)
            tasks_to_display = HandOver.query.filter(
                HandOver.date_created >= last_24_hours
            ).order_by(HandOver.date_created.desc()).all()

            if not tasks_to_display:
                tasks_to_display = HandOver.query.order_by(
                    HandOver.date_created.desc()
                ).limit(2).all()

        # Format response
        task_list = [{
            "username": task.username,
            "date_created": task.date_created.isoformat(),
            "description":task.description,
            "task_handled": task.task_handled,
            "task_status": task.task_status
        } for task in tasks_to_display]

        return jsonify({"tasks": task_list}), 200


    @csrf.exempt
    @app.route('/api/login', methods=['POST'])
    def api_login():
        data = request.get_json(force=True)

        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            login_user(user)
            session.permanent = True 
            return jsonify({
                "user": {
                    "username": user.username,
                    "email": user.email
                }
                }), 200

        else:
            return jsonify({"message": "Invalid email or password"}), 401

    @app.route("/logout", methods=['POST'])
    @login_required
    def logout():
        logout_user()
        return jsonify({"message": "Logged out"}), 200


    # Admin route (requires login)
    @app.route("/admin")
    @login_required
    def admin():
        return redirect('login')
        
    @csrf.exempt
    @app.route("/api/create_task", methods=['POST'])
    @login_required
    def create_task():
        data = request.get_json()
        tasks = data.get('tasks', [])

        try:
            for task_entry in tasks:
                task = task_entry['task_handled'].strip()
                description=task_entry['description'].strip()
                status = task_entry['task_status']
                if task:
                    new_task = HandOver(
                        username=current_user.username,
                        description=description,
                        task_handled=task,
                        task_status=status,
                        user_id=current_user.id
                    )
                    db.session.add(new_task)
            db.session.commit()
            return jsonify({"status": "success"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"status": "error", "message": str(e)}), 500

    @app.route('/tasks/pending', methods=['GET'])
    def get_pending_tasks():
        tasks = HandOver.query.filter(
            HandOver.task_status.in_(["In Progress", "Not Started"])
        ).order_by(HandOver.date_created.asc()).all()

        return jsonify({
            "tasks": [
                {
                    "id": task.id,
                    "username": task.username,
                    "date_created": task.date_created.isoformat(),
                    "description":task.description,
                    "task_handled": task.task_handled,
                    "task_status": task.task_status
                } for task in tasks
            ]
        })

    @csrf.exempt    
    @app.route('/tasks/<int:task_id>/update', methods=['POST'])
    def update_task_status(task_id):
        data = request.get_json()
        print("Incoming data:", data)

        new_status = data.get("status")
        if new_status is None:
            return jsonify({"error": "Missing 'status' in request"}), 400

        task = HandOver.query.get_or_404(task_id)
        print("Fetched task:", task)

        task.task_status = new_status
        db.session.add(task)
        db.session.commit()

        updated_task = HandOver.query.get(task_id)
        print("Updated status:", updated_task.task_status)

        return jsonify({"message": f"Task {task_id} updated to {new_status}."})



