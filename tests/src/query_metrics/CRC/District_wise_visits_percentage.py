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
        district = CRC_Query()
        df1 = pd.read_sql_query(district.district_wise_percentage, self.connection)
        district1 = crc_get_data()
        df2 = pd.DataFrame.from_records(district1.dist_wise_crc(config['url']['domain']+'crc/districtWise')['visits'])
        df2.columns = map(str.lower, df2.columns)
        df1=df1.fillna(0)
        df2 = df2[['districtid', 'districtname', 'visit_0', 'visit_1_2', 'visit_3_5','visit_6_10', 'visit_10_more']].fillna(0)
        df2['visit_0'] = df2['visit_0'].astype(float)
        df2['visit_1_2'] = df2['visit_1_2'].astype(float)
        df2['visit_3_5'] = df2['visit_3_5'].astype(float)
        df2['visit_6_10'] = df2['visit_6_10'].astype(float)
        df2['visit_10_more'] = df2['visit_10_more'].astype(float)

        df_diff = pd.concat([df1, df2]).drop_duplicates(keep=False)
        print(df_diff.sort_values(by='districtid').head())
        assert df_diff.empty, "Found difference between s3 bucket metrics and the metrics generated outside cqube for district wise visits percentage "
        print("No Difference between s3 bucket metrics and the metrics generated outside cqube for district wise visits percentage")



    def tearDown(self):
        self.connection.close()