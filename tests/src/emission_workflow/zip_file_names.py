#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun May 31 09:30:34 2020

@author: prashanth
"""
import os
import configparser
config=configparser.ConfigParser()

config.read('zip_file_names.ini')
files_count = []

def line_count():
    for file in config['zip_files']:
        print(file,":",int(os.popen('''zgrep -Ec "$" {}{}'''.format(config['emission_path']['path'],config['zip_files'][file])).read()))
    
if __name__ == '__main__':
    line_count()

