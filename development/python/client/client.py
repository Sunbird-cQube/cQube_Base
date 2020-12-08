#!/usr/bin/env python

from os.path import split, isdir, isfile
from os import path, walk
import json
import requests
import time
from config import *
import logging
from datetime import datetime
st=time.time()


file_path = file_path
emission_url= emission_url
if emission_url[-1]!='/':
    emission_url+='/'
headers = { "Content-Type" : "application/json" }
access_token=access_token

def get_s3_url(filename,access_token):
    """creates one time pre-signed s3 url with given filename"""
    s3_url = emission_url+"upload-url"
    headers = { "Authorization" :"Bearer " + access_token}
    payload = { "filename": filename }
    res_s3_url = requests.post(s3_url, headers = headers, data=payload)
    return res_s3_url

def file_upload(aws_url, filename):
    """upload the file using one time pre-signed s3 url"""
    with open(filename, 'rb') as f:
        files = {'file': (filename, f)}
        http_response = requests.post(aws_url['url'], data=aws_url['fields'], files=files)
    return http_response

def abs_file_path(file_path):
    "Get the absolute path and relative path"
    file_set = set()
    root_dir=split(file_path)[0]
    for root, dirs, files in walk(file_path):
        for file_name in files:
            full_path = path.join(root, file_name)
            rel_path = path.relpath(full_path, root_dir)
            file_set.add((full_path, rel_path))
    return file_set

def main():
    file_list = abs_file_path(file_path)
    if isdir(file_path):
        filelist = abs_file_path(file_path)
        for full_path,rel_path in filelist:
            logging.info("Emission start time {} for file {}\n".format(datetime.now().strftime('%d-%m-%Y %H:%M:%S'),full_path))
            aws_url=get_s3_url(rel_path,access_token)
            res=file_upload(aws_url.json(),full_path)
            logging.info("Emission end time {} for file {} with status code{}\n".format(datetime.now().strftime('%d-%m-%Y %H:%M:%S'),full_path,res.status_code))
    elif isfile(file_path):
        logging.info("Emission start time {} for file {}\n".format(datetime.now().strftime('%d-%m-%Y %H:%M:%S'),file_path))
        aws_url=get_s3_url(file_path.split('/')[-1],access_token)
        logging.info("logging s3 url{}".format(aws_url.text))
        res=file_upload(aws_url.json(),file_path)
        logging.info("Emission end time {} for file {} with url {} and status code{}\n".format(datetime.now().strftime('%d-%m-%Y %H:%M:%S'),file_path,aws_url.text,res.status_code))

if __name__=="__main__":
    logging.basicConfig(filename='emission.log',filemode='a',level=logging.DEBUG)
    main()
    et=time.time()
    print(et-st)
