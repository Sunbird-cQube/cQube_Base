#!/usr/bin/env python

import glob2
import json
import yaml

input_dir  = "nifi_parameters/"
output_dir = "nifi_json_files/"


with open('config.yml','r') as yaml_property:
    yaml_config=yaml.safe_load(yaml_property)


def write_file():

    my_list_files = glob2.glob(input_dir+"*.json");
    for file_name in my_list_files:
        with open(file_name,'r') as json_payload:
            param=json.load(json_payload)
        for nifi_param in param['component']['parameters']:
            for key in nifi_param:
                if yaml_config.get(nifi_param[key]['name']):
                     nifi_param[key]['value']=yaml_config.get(nifi_param[key]['name'])
        w = file_name.split('/')[::-1][0]
        z = w.replace('_params','');
        file_path = output_dir+z;
        with open(file_path,'w') as json_config:
            json.dump(param, json_config)

write_file()

