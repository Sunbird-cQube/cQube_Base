from flask import abort
from flask_restful import reqparse
from flask_jwt import JWT, jwt_required, current_identity
from config import app, db
from users import User
from models import Users, UserSchema
from config import bcrypt
import os
from env import *
import logging
import boto3
from botocore.client import Config
from botocore.exceptions import ClientError

s3_signature ={
    'v4':'s3v4',
    'v2':'s3'
}

AWS_ACCESS_KEY = AWS_ACCESS_KEY
AWS_SECRET_KEY = AWS_SECRET_KEY
AWS_DEFAULT_REGION =  AWS_DEFAULT_REGION

def create_presigned_url(bucket_name, bucket_key, expiration=3600, signature_version=s3_signature['v4']):
    s3_client = boto3.client('s3',
                             aws_access_key=AWS_ACCESS_KEY,
                             aws_secret_key=AWS_SECRET_KEY,
                             config=Config(signature_version=signature_version),
                             region_name=AWS_DEFAULT_REGION
                             )
    try:
        response = s3_client.generate_presigned_url('put_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': bucket_key},
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
        .filter(Users.email == username) \
        .filter(Users.status == 'A') \
        .all()
    if existing_person:
        return existing_person
    else:
        return None

def authenticate(username, password):
    user = active_user(username)[0]
    users = [User(user.user_id,user.email,user.password)]
    lusers = {u.username: u for u in users}
    user = lusers.get(username, None)
    if user and \
            bcrypt.check_password_hash(user.password, password):
        return user
    else:
        abort(409, f'User not available')

def identity(payload):
    user_id = payload['identity']
    return get_user_id(user_id)[0].get('user_id', None)

jwt = JWT(app, authenticate, identity)

@app.route('/protected')
@jwt_required()
def protected():
    return '%s' % current_identity

@app.route("/user",methods=["POST"])
@jwt_required()
def create():
    parser = reqparse.RequestParser()
    fname = parser.add_argument("fname")
    mname = parser.add_argument("mname")
    lname = parser.add_argument("lname")
    password = parser.add_argument("password")
    args = parser.parse_args()
    args["email"]=(str(args["fname"])+str(args["mname"])+str(args["lname"])+"@cqube.com").lower()
    args["status"] = "A"
    args["password"]=bcrypt.generate_password_hash(args["password"]).decode('UTF-8')
    existing_person = Users.query \
        .filter(Users.fname == args["fname"]) \
        .filter(Users.fname == args["mname"]) \
        .filter(Users.lname == args["lname"]) \
        .filter(Users.lname == args["email"]) \
        .one_or_none()
    if existing_person is None:
        schema = UserSchema()
        new_user = schema.load(args, session=db.session)
        db.session.add(new_user)
        db.session.commit()
        return schema.dump(new_user).get("email"), 201
    else:
        logging.info(f'User {fname} {mname} {lname} exists already')
        abort(409, f'User {fname} {mname} {lname} exists already')

@app.route('/upload-url',methods=['POST'])
@jwt_required()
def aws_upload_url():
    parser = reqparse.RequestParser()
    filename = parser.add_argument("filename")
    args = parser.parse_args()
    if args["filename"]:
        return create_presigned_url(BUCKET_NAME,str(args["filename"]))
    else:
        return "Filename is required"
