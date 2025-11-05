from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField,TextAreaField,SelectField,FieldList, FormField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
from hand.models import User


class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=2, max=20)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('That username is taken. Please choose a different one.')

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('That email is already registered.')

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')

class TaskFieldForm(FlaskForm):
    class Meta:
        csrf = False 
    task_handled = StringField('Task Handled', validators=[DataRequired()])
    task_status = SelectField('Task Status', choices=[
        ('Not Started', 'Not Started'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed')
    ], validators=[DataRequired()])
    description = StringField('Description', validators=[DataRequired()]) 

class TaskForm(FlaskForm):
    task_handled = FieldList(FormField(TaskFieldForm), min_entries=5, max_entries=10)
    submit = SubmitField('Submit Tasks')
