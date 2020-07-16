import json
from config import *
from flask import Flask, g
from flask_oidc import OpenIDConnect
from flask_restful import reqparse
import requests
from flask import abort, Response, request, send_from_directory
from flask_restful import reqparse
from werkzeug.utils import secure_filename
from env import *
import logging
from datetime import datetime
from botocore.client import Config
from botocore.exceptions import ClientError
from boto3 import client
from os.path import exists, join
from os import path, walk
from json import dumps
import pandas as pd
from io import BytesIO

def update_client_secrets():
    KEYCLOAK_URL="{DOMAIN_NAME}/auth/realms/{REALM_NAME}".format(DOMAIN_NAME=DOMAIN_NAME,REALM_NAME=REALM_NAME)
    issuer=KEYCLOAK_URL
    auth_uri="{KEYCLOAK_URL}/protocol/openid-connect/auth".format(KEYCLOAK_URL=KEYCLOAK_URL)
    client_id=CLIENT_ID
    client_secret=CLIENT_SERCET
    redirect_uris="{EMISSION_URL}/*".format(EMISSION_URL=EMISSION_URL)
    userinfo_uri="{KEYCLOAK_URL}/protocol/openid-connect/userinfo".format(KEYCLOAK_URL=KEYCLOAK_URL)
    token_uri="{KEYCLOAK_URL}/protocol/openid-connect/token".format(KEYCLOAK_URL=KEYCLOAK_URL)
    token_introspection_uri="{KEYCLOAK_URL}/protocol/openid-connect/token/introspect".format(KEYCLOAK_URL=KEYCLOAK_URL)
    clientsecret={ "web": { "issuer": KEYCLOAK_URL, "auth_uri": auth_uri, "client_id": CLIENT_ID, "client_secret": CLIENT_SERCET, "redirect_uris": [ redirect_uris ], "userinfo_uri": userinfo_uri, "token_uri": token_uri, "token_introspection_uri": token_introspection_uri, "OIDC-SCOPES": ["openid"] } }
    client_secrets=json.dumps(clientsecret)
    with open("client_secrets.json","w") as fd:
        fd.write(client_secrets)
update_client_secrets()

app = Flask(__name__)
app.config.update({
    'SECRET_KEY': 'secret_key',
    'OIDC_CLIENT_SECRETS': 'client_secrets.json',
    'OIDC_ID_TOKEN_COOKIE_SECURE': False,
    'OIDC_REQUIRE_VERIFIED_EMAIL': False,
    'OIDC_USER_INFO_ENABLED': True,
    'OIDC_OPENID_REALM': REALM_NAME,
    'OIDC_TOKEN_TYPE_HINT': 'access_token',
    'OIDC_SCOPES': ['openid', 'email', 'profile'],
    'OIDC_INTROSPECTION_AUTH_METHOD': 'client_secret_post'
})

app.logger.addHandler(file_handler)
app.logger.addHandler(access_handler)
app.debug=False


oidc = OpenIDConnect(app)


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

@app.route('/auth', methods=['POST'])
def api_login():
    url=DOMAIN_NAME+"/auth/realms/"+REALM_NAME+"/protocol/openid-connect/token"
    headers = { 'content-type': "application/x-www-form-urlencoded" }
    parser = reqparse.RequestParser()
    username = parser.add_argument("username")
    password = parser.add_argument("password")
    args = parser.parse_args()
    if username and password:
        try:
            payload= {"client_id" :CLIENT_ID,"grant_type":"password","client_secret":CLIENT_SERCET,"scope":"openid",
            "username":args["username"],"password":args["password"]}
            resp=requests.post(url,data=payload,headers=headers)
            return resp.json()
        except Exception as err:
            logging.error(err)
    else:
        abort(401, f'User unauthorized')

def validate_role(token):
    user_role = token.get("realm_access")
    if "admin" in user_role["roles"] or "emission" in user_role["roles"]:
        return "Valid role"
    else:
        abort(401, f'Invalid user roles to access api')

@app.route('/upload-url',methods=['POST'])
@oidc.accept_token(require_token=True, scopes_required= ['openid'])
def aws_upload_url():
    validate_role(g.oidc_token_info)
    parser = reqparse.RequestParser()
    filename = parser.add_argument("filename")
    args = parser.parse_args()
    if args["filename"]:
        return create_presigned_post(EMISSION_BUCKET_NAME,str(args["filename"]))
    else:
        abort(400, f'Bad request, validate the payload')

@app.route('/download_url',methods=['POST'])
@oidc.accept_token(require_token=True, scopes_required= ['openid'])
def aws_file_download():
    validate_role(g.oidc_token_info)
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
@oidc.accept_token(require_token=True, scopes_required= ['openid'])
def aws_file_downloads():
    validate_role(g.oidc_token_info)
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
@oidc.accept_token(require_token=True, scopes_required= ['openid'])
def list_s3_files():
    validate_role(g.oidc_token_info)
    parser = reqparse.RequestParser()
    bucket = parser.add_argument("bucket")
    args = parser.parse_args()
    bucket_name = get_bucket_name(args["bucket"])
    s3_client = get_s3_client()
    return s3_client.list_objects(Bucket=bucket_name)

@app.route('/download', methods=['POST'])
@oidc.accept_token(require_token=True, scopes_required= ['openid'])
def index():
    validate_role(g.oidc_token_info)
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
@oidc.accept_token(require_token=True, scopes_required= ['openid'])
def list_s3_buckets():
    validate_role(g.oidc_token_info)
    return dumps({"input":INPUT_BUCKET_NAME,"output":OUTPUT_BUCKET_NAME,"emission":EMISSION_BUCKET_NAME})

@app.route('/list_log_files',methods=['GET'])
@oidc.accept_token(require_token=True, scopes_required= ['openid'])
def files_list(file_path=BASE_DIR):
    validate_role(g.oidc_token_info)
    file_list=list()
    for root, dirs, files in walk(file_path):
        file_list.append({"path": path.relpath(root, file_path), "directories": dirs, "files": files})
    return dumps(file_list)

@app.route('/log-download', methods=['POST'])
@oidc.accept_token(require_token=True, scopes_required= ['openid'])
def log_download():
    validate_role(g.oidc_token_info)
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
        df = pd.read_csv(BytesIO(infra_file['Body'].read()),sep='|')
        if df["score"].sum() == 100:
            if list(df.columns) == list(wdf.columns):
                return True
            else:
                abort(400, f'Bad file header, please check the file header')
        else:
            abort(400, f'Bad file, validate the score, score sum is not 100')
    except Exception as err:
        abort(400,err)

@app.route('/infra_weights',methods=['POST'])
@oidc.accept_token(require_token=True, scopes_required= ['openid'])
def upload_file():
    validate_role(g.oidc_token_info)
    uploaded_file = request.files['file']
    content_type = 'application/json'
    filename = secure_filename(uploaded_file.filename)
    if filename:
        s3_client = get_s3_client()
        csv_buffer = uploaded_file.read()
        wdf = pd.read_csv(BytesIO(csv_buffer),sep='|')
        validate_weights(wdf)
        resp = s3_client.put_object(Body=csv_buffer,
                          Bucket=EMISSION_BUCKET_NAME,
                          Key="infrastructure_score/infrastructure_score.csv",
                          ContentType=content_type)
        return resp
