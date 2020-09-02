import json

import psycopg2
import pandas as pd
import configparser

from get_dir import pwd

config = configparser.ConfigParser()
import pandas.io.sql as sqlio
import psycopg2
p=pwd()
config.read(p.get_database_ini_path())

class cqube():

    def connect_to_postgres(self):
        con = psycopg2.connect(host=config['pgsql']['host'], database=config['pgsql']['database'],
                               user=config['pgsql']['user'], password=config['pgsql']['password'])
        return con

    def openfile(self,filename):
        with open(filename,"r") as file:
            json_data=json.load(file)
            return json_data