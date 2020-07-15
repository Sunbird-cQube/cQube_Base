from flask import abort, Response, request, send_from_directory
from flask_restful import reqparse
from werkzeug.utils import secure_filename
from flask_jwt import JWT, jwt_required, current_identity
from config import app
from users import User
from models import Users
from config import bcrypt
from env import *
import logging
from datetime import datetime
from botocore.client import Config
from botocore.exceptions import ClientError
from boto3 import client
from os.path import exists, join
from os import path, walk
from json import dumps, load
import pandas as pd
from io import BytesIO, StringIO

def get_s3_client():
    s3_signature = {
        'v4': 's3v4',
        'v2': 's3'
    }
    return client('s3',
                     aws_access_key_id=AWS_ACCESS_KEY,
                     aws_secret_access_key=AWS_SECRET_KEY,
                     config=Config(signature_version=s3_signature['v4']),
                     region_name=AWS_DEFAULT_REGION
                     )

def create_presigned_post(bucket_name, object_name,
                          fields=None, conditions=None, expiration=3600):
    s3_client = get_s3_client()

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
        .filter((Users.role_id == 5) | (Users.role_id == 1)) \
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
        return create_presigned_post(EMISSION_BUCKET_NAME,str(args["filename"]))
    else:
        abort(400, f'Bad request, validate the payload')

@app.route('/download_url',methods=['POST'])
@jwt_required()
def aws_file_download():
    s3_client = get_s3_client()
    parser = reqparse.RequestParser()
    filename = parser.add_argument("filename")
    bucket = parser.add_argument("bucket")
    args = parser.parse_args()
    bucket_name = get_bucket_name(args["bucket"])
    if args["filename"]:
        file_name=args["filename"]
    try:
        response = s3_client.generate_presigned_url('get_object',
                                                     Params={'Bucket':bucket_name,'Key':file_name},
                                                     ExpiresIn=300)
    except ClientError as e:
        logging.error(e)
        return None

    return response


@app.route('/download_uri',methods=['POST'])
@jwt_required()
def aws_file_downloads():
    s3_client = get_s3_client()
    parser = reqparse.RequestParser()
    filename = parser.add_argument("filename", action='append')
    bucket = parser.add_argument("bucket")
    args = parser.parse_args()
    bucket_name = get_bucket_name(args["bucket"])
    if args["filename"]:
        file_name=args.get("filename")
    file_resp=dict()
    files=args["filename"]
    for file in files:
        print(file)
        try:
            response = s3_client.generate_presigned_url('get_object',
                                                         Params={'Bucket':bucket_name,'Key':file},
                                                         ExpiresIn=300)
            file_resp[file]=response
            print(file_resp,file)
        except ClientError as e:
            logging.error(e)
            return None
    return file_resp

def get_total_bytes(s3,bucket_name,file_name):
    result = s3.list_objects(Bucket=bucket_name)
    for item in result['Contents']:
        if item['Key'] == file_name:
            return item['Size']

def get_object(s3,bucket_name,file_name, total_bytes):
    if total_bytes > 1000000:
        return get_object_range(s3, bucket_name, file_name, total_bytes)
    return s3.get_object(Bucket=bucket_name, Key=file_name)['Body'].read()

def get_object_range(s3,bucket_name, file_name, total_bytes):
    offset = 0
    while total_bytes > 0:
        end = offset + 999999 if total_bytes > 1000000 else ""
        total_bytes -= 1000000
        byte_range = 'bytes={offset}-{end}'.format(offset=offset, end=end)
        offset = end + 1 if not isinstance(end, str) else None
        yield s3.get_object(Bucket=bucket_name, Key=file_name, Range=byte_range)['Body'].read()

def get_bucket_name(bucket):
    if bucket==INPUT_BUCKET_NAME or bucket==OUTPUT_BUCKET_NAME or bucket==EMISSION_BUCKET_NAME:
        return bucket
    else:
        abort(400, f'Bad request, validate the bucket name')

def valid_path(filename):
    full_path = join(BASE_DIR, filename)
    if not exists(full_path):
        return abort(404, f'Bad request, validate the filename in payload')

@app.route('/list_s3_files',methods=['POST'])
@jwt_required()
def list_s3_files():
    parser = reqparse.RequestParser()
    bucket = parser.add_argument("bucket")
    args = parser.parse_args()
    bucket_name = get_bucket_name(args["bucket"])
    s3_client = get_s3_client()
    return s3_client.list_objects(Bucket=bucket_name)

@app.route('/download', methods=['POST'])
@jwt_required()
def index():
    s3 = get_s3_client()
    parser = reqparse.RequestParser()
    filename = parser.add_argument("filename")
    bucket = parser.add_argument("bucket")
    args = parser.parse_args()
    bucket_name = get_bucket_name(args["bucket"])
    if args["filename"]:
        total_bytes = get_total_bytes(s3,bucket_name,args["filename"])
        return Response(
            get_object(s3, bucket_name, args["filename"], total_bytes),
            mimetype='text/plain',
            headers={"Content-Disposition": "attachment;filename={}".format(args["filename"].split('/')[-1])}
        )
    else:
        print(args["filename"])
        abort(400, f'Bad request, validate the filename in payload')

@app.route('/list_s3_buckets',methods=['GET'])
@jwt_required()
def list_s3_buckets():
    return dumps({"input":INPUT_BUCKET_NAME,"output":OUTPUT_BUCKET_NAME,"emission":EMISSION_BUCKET_NAME})

@app.route('/list_log_files',methods=['GET'])
@jwt_required()
def files_list(file_path=BASE_DIR):
    file_list=list()
    for root, dirs, files in walk(file_path):
        file_list.append({"path": path.relpath(root, file_path), "directories": dirs, "files": files})
    return dumps(file_list)

@app.route('/log-download', methods=['POST'])
@jwt_required()
def log_download():
    parser = reqparse.RequestParser()
    filename = parser.add_argument("filename")
    args = parser.parse_args()
    if args["filename"]:
        valid_path(args["filename"])
        return send_from_directory(BASE_DIR,filename=args["filename"], as_attachment=True)
    else:
        abort(400, f'Bad request, filename not provided in payload')

def validate_weights(wdf):
    s3_client = get_s3_client()
    try:
        infra_file=s3_client.get_object(Bucket=OUTPUT_BUCKET_NAME,
                             Key="infrastructure_score/infrastructure_score.csv")
        df = pd.read_csv(BytesIO(infra_file['Body'].read()))
        if df["score"].sum() == 100:
            if list(df.columns) == list(wdf.columns):
                return True
            else:
                abort(400, f'Bad files, please check the file header')
        else:
            abort(400, f'Bad file, validate the score, score sum is not 100')
    except Exception as err:
        abort(400,err)

@app.route('/infra_weights',methods=['POST'])
@jwt_required()
def upload_file():
    uploaded_file = request.files['file']
    content_type = request.mimetype
    filename = secure_filename(uploaded_file.filename)
    if filename:
        s3_client = get_s3_client()
        csv_buffer = uploaded_file.read()
        wdf = pd.read_csv(BytesIO(csv_buffer))
        validate_weights(wdf)
        resp = s3_client.put_object(Body=csv_buffer,
                          Bucket=EMISSION_BUCKET_NAME,
                          Key="infrastructure_score/infrastructure_score.csv",
                          ContentType=content_type)
        return resp
