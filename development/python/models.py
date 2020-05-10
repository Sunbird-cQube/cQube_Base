from datetime import datetime
from config import db,ma

class Users(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, db.Sequence('user_id_seq'),primary_key=True, index=True)
    fname = db.Column(db.String(30))
    mname = db.Column(db.String(30))
    lname = db.Column(db.String(30))
    email = db.Column(db.String(100))
    password = db.Column(db.String(80))
    status = db.Column(db.String(1), default='A')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserSchema(ma.ModelSchema):
    class Meta:
        model = Users
        sql_session = db.session