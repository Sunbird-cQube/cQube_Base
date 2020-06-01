import configparser
import requests
import json
import boto3
import os
from botocore.client import Config
from botocore.exceptions import ClientError
from dateutil.tz import tz
from datetime import datetime

config = configparser.ConfigParser()
config.read('Emission_API_Config.ini')


def get_emission_access_token(username, password):
    """
     Gets the access token and validates the HTTP status and checks whether the API access token is returned or not
     :param username  :type str
     :param password :type str
     :return API Access token :type dict
    """
    header = {"Content-Type": "application/json"}
    data = {"username": username, "password": password}
    response = requests.post(
        url=config['EMISSION_API']['IP'] + ':' + config['EMISSION_API']['PORT'] + config['EMISSION_API'][
            'AUTH_ENDPOINT'], headers=header, data=json.dumps(data))
    return response


def get_s3_one_time_url(filename,access_token):
    """
    Gets the S3 one time url for defined filename validates the HTTP status and checks whether S3 one time url is returned or not
    :param filename :type str
    :param access_token :type str
    """
    headers = {"Authorization": "JWT " + access_token}
    payload = {"filename": filename}
    res_s3_url = requests.post(url=config['EMISSION_API']['IP']+':'+config['EMISSION_API']['PORT']+config['EMISSION_API']['UPLOAD_ENDPOINT'], headers=headers, data=payload)
    return res_s3_url


def get_s3_client_connection():
    """

    :return: S3 client connection object
    """
    s3_signature = {
        'v4': 's3v4',
        'v2': 's3'
    }
    try:
        s3_client = boto3.client('s3',
                                 aws_access_key_id=config['EMISSION_API']['S3_ACCESS_KEY'],
                                 aws_secret_access_key=config['EMISSION_API']['S3_SECRET_KEY'],
                                 config=Config(signature_version=s3_signature['v4']),
                                 region_name=config['EMISSION_API']['S3_REGION']
                                 )
        return s3_client

    except ClientError as e:
        return False


def file_upload():
    """
    upload the file using one time pre-signed s3 url
    """

    access_token_res = get_emission_access_token(config['EMISSION_API']['VALID_USERNAME'],
                                                 config['EMISSION_API']['VALID_PASSWORD'])

    if access_token_res.status_code is 200:
        print(access_token_res.json()['access_token'])

        s3_ot_url_res = get_s3_one_time_url(config['EMISSION_API']['UPLOAD_FILENAME'],access_token_res.json()['access_token'])
        filename = config['EMISSION_API']['UPLOAD_FILENAME']
        file_size = os.stat(filename)
        with open(filename, 'rb') as f:
            files = {'file': (filename, f)}
            s3_ot_url_res = requests.post(s3_ot_url_res.json()['url'], data=s3_ot_url_res.json()['fields'], files=files)
            http_response = s3_ot_url_res

            # converting to IST timezone
            timezone_ist = tz.gettz('Asia/Kolkata')
            file_upload_time = datetime.strftime(datetime.now(timezone_ist), "%Y-%m-%d %H:%M:%S.%f")
            return {"Response":http_response,"file_upload_time":file_upload_time,"filename":filename,"file_size":file_size.st_size/1024}
    else:
        print('Error getting access token')


def get_s3_emission_bucket_version():
    """
    :return: S3 objects with versions
    """
    s3 = get_s3_client_connection()
    response = s3.list_object_versions(Bucket=config['EMISSION_API']['S3_BUCKET_NAME'])
    return response


def get_files_from_emission_bucket(filename):
    """
    :param filename, example='test.zip'
    :return latest file version
    """
    res = get_s3_emission_bucket_version()
    files_list =[]

    # loop to get the latest version of the file
    for i in res['Versions']:
        if i['Key'] == filename:
            files_list.append({"Key":i['Key'], "LastModified": i['LastModified'], "Size": i['Size']/1024})
    else:
        print({"File not found"})

    # Get the latest file based on datetime
    latest_file = max(files_list, key=lambda x: x['LastModified'])

    # Converting to IST Timezone
    timezone_ist = tz.gettz('Asia/Kolkata')
    latest_file['LastModified'] =latest_file['LastModified'].astimezone(timezone_ist)
    return latest_file


# TEST SCENARIO 1
def test_emission_valid_user_valid_pwd():
    """
    # Username : valid username
    # Password : valid password
     """
    res = get_emission_access_token(config['EMISSION_API']['VALID_USERNAME'], config['EMISSION_API']['VALID_PASSWORD'])
    assert res.status_code == 200
    assert res.json()['access_token'] is not None


# TEST SCENARIO 2
def test_emission_valid_user_invalid_pwd():
    """
    # Username : valid username
    # Password : invalid password
    """
    res = get_emission_access_token(config['EMISSION_API']['VALID_USERNAME'], config['EMISSION_API']['INVALID_PASSWORD'])
    assert res.status_code != 200


# TEST SCENARIO 3
def test_emission_invalid_user_valid_pwd():
    """
    # Username : invalid username
    # Password : valid password
    """
    res = get_emission_access_token(config['EMISSION_API']['INVALID_USERNAME'], config['EMISSION_API']['VALID_PASSWORD'])
    assert res.status_code != 200


# TEST SCENARIO 4
def test_emission_invalid_user_invalid_pwd():
    """
    # Username : invalid username
    # Password : invalid password
    """
    res = get_emission_access_token(config['EMISSION_API']['INVALID_USERNAME'], config['EMISSION_API']['INVALID_PASSWORD'])
    assert res.status_code != 200


# TEST SCENARIO 5
def test_invalid_access_token():
    """
    Passing invalid access token
    """
    s3_ot_url_res = get_s3_one_time_url(config['EMISSION_API']['UPLOAD_FILENAME'],config['EMISSION_API']['INVALID_TOKEN'])
    assert s3_ot_url_res.status_code != 200


# TEST SCENARIO 6
def test_valid_access_token():
    """
    Passing valid access token
    """
    access_token_res = get_emission_access_token(config['EMISSION_API']['VALID_USERNAME'], config['EMISSION_API']['VALID_PASSWORD'])
    assert access_token_res.status_code == 200

    if access_token_res is 200 and access_token_res.json()['access_token'] is not  None:
        s3_ot_url_res = get_s3_one_time_url(config['EMISSION_API']['UPLOAD_FILENAME'], access_token_res.json()['access_token'])
        assert s3_ot_url_res.status_code == 200


# TEST SCENARIO 7
def test_verify_file_upload():
    """
    verify the file upload with emission bucket
        1. verifies the file name from .ini file  with s3
        2. verifies the file size with s3
     """
    file_detail = file_upload()
    s3_file = get_files_from_emission_bucket(config['EMISSION_API']['UPLOAD_FILENAME'])
    s3_ist_time = datetime.strftime(s3_file['LastModified'], "%Y-%m-%d %H:%M:%S")
    assert s3_ist_time >= file_detail['file_upload_time'] and file_detail['file_size'] == s3_file['Size']