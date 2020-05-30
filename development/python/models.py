from config import db,ma

class Users(db.Model):
    __tablename__ = 'users_authentication'
    user_id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(30))
    middle_name = db.Column(db.String(30))
    last_name = db.Column(db.String(30))
    user_email = db.Column(db.String(100))
    password = db.Column(db.String(256))
    user_status = db.Column(db.Integer)
    role_id = db.Column(db.Integer)
    user_validity_start_date = db.Column(db.DateTime)
    user_validity_end_date = db.Column(db.DateTime)

class UserSchema(ma.ModelSchema):
    class Meta:
        model = Users
        sql_session = db.session
