from flask import abort
from flask_restful import reqparse
from flask_jwt import JWT, jwt_required, current_identity
from config import app
from users import User
from models import Users
from config import bcrypt
from env import *
import logging
import boto3
from datetime import datetime
from botocore.client import Config
from botocore.exceptions import ClientError

s3_signature ={
    'v4':'s3v4',
    'v2':'s3'
}

AWS_ACCESS_KEY = AWS_ACCESS_KEY
AWS_SECRET_KEY = AWS_SECRET_KEY
AWS_DEFAULT_REGION =  AWS_DEFAULT_REGION

def create_presigned_post(bucket_name, object_name,
                          fields=None, conditions=None, expiration=3600):
    s3_signature ={
    'v4':'s3v4',
    'v2':'s3'
}
    s3_client = boto3.client('s3',
                             aws_access_key_id=AWS_ACCESS_KEY,
                             aws_secret_access_key=AWS_SECRET_KEY,
                             config=Config(signature_version=s3_signature['v4']),
                             region_name=AWS_DEFAULT_REGION
                             )

    try:
        response = s3_client.generate_presigned_post(bucket_name,
                                                     object_name,
                                                     ExpiresIn=expiration)
    except ClientError as e:
        logging.error(e)
        return None

    return response


def get_user_id(user_id):
    existing_person = Users.query.filter(Users.user_id == user_id).all()
    if existing_person:
        luser_id = [
            {
                "user_id": user.user_id,
            } for user in existing_person
        ]
        return luser_id

def active_user(username):
    existing_person = Users.query \
        .filter(Users.user_email == username) \
        .filter(Users.user_status == 1) \
        .filter(Users.role_id == 5) \
        .filter(Users.user_validity_start_date <= datetime.now().strftime('%Y-%m-%d %H:%M:%S')) \
        .filter(Users.user_validity_end_date >= datetime.now().strftime('%Y-%m-%d %H:%M:%S')) \
        .all()
    if existing_person:
        return existing_person
    else:
        abort(401, f'User unauthorized')

def authenticate(username, password):
    user = active_user(username)[0]
    users = [User(user.user_id,user.user_email,user.password)]
    lusers = {u.username: u for u in users}
    user = lusers.get(username, None)
    if user and \
            bcrypt.check_password_hash(user.password, password):
        return user
    else:
        abort(401, f'User unauthorized')

def identity(payload):
    user_id = payload['identity']
    return get_user_id(user_id)[0].get('user_id', None)

jwt = JWT(app, authenticate, identity)

@app.route('/protected')
@jwt_required()
def protected():
    return '%s' % current_identity

@app.route('/upload-url',methods=['POST'])
@jwt_required()
def aws_upload_url():
    parser = reqparse.RequestParser()
    filename = parser.add_argument("filename")
    args = parser.parse_args()
    if args["filename"]:
        return create_presigned_post(BUCKET_NAME,str(args["filename"]))
    else:
        abort(400, f'Bad request, validate the payload')
