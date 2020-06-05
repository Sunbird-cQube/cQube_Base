import configparser
import time
import unittest
import pandas as pd
import requests

from CRC.reuse_func import  crc_get_data
from Queries.test_crc_quary import CRC_Query
from Queries.test_query import TestQuery
from TS.reuse_func import cqube
from get_dir import pwd
config = configparser.ConfigParser()
config.read('../crc.ini')

class Crc(unittest.TestCase):
    def setUp(self):
        con = cqube()
        self.connection = con.connect_to_postgres()

    def test_query(self):
        school = CRC_Query()
        df1 = pd.read_sql_query(school.schoolwise_visited, self.connection)
        df1 = df1[['schoolid', 'schoolname', 'total_visits']]
        df1.rename(columns={'total_visits': 'totalvisits'}, inplace=True)
        school1 = crc_get_data()
        df2 = pd.DataFrame.from_records(school1.dist_wise_crc(config['url']['domain']+'crc/allSchoolWise')['visits'])
        df2.columns = map(str.lower, df2.columns)
        df2 = df2[['schoolid', 'schoolname', 'totalvisits']]
        df2['totalvisits'] = df2['totalvisits'].astype(float)
        df_diff = pd.concat([df1, df2]).drop_duplicates(keep=False)
        assert df_diff.empty, "Found difference between s3 bucket metrics and the metrics generated outside cqube for school wise visited "
        print("No Difference between s3 bucket metrics and the metrics generated outside cqube for school wise visited")



    def tearDown(self):
        self.connection.close()