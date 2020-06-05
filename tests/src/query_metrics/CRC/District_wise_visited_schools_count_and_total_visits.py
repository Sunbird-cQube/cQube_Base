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
        df1 = pd.read_sql_query(district.districtwise_visited, self.connection)
        district1 = crc_get_data()
        df2 = pd.DataFrame.from_records(district1.dist_wise_crc(config['url']['domain']+'crc/districtWise')['visits'])
        df2.columns = map(str.lower, df2.columns)
        df1.rename(columns={'visited_schools_count': 'visitedschoolcount', 'total_visits': 'totalvisits'}, inplace=True)
        df2 = df2[['districtid', 'districtname', 'visitedschoolcount', 'totalvisits']]
        df2['visitedschoolcount']=df2['visitedschoolcount'].astype(int)
        df2['totalvisits'] = df2['totalvisits'].astype(int)
        df_diff = pd.concat([df1, df2]).drop_duplicates(keep=False)
        assert df_diff.empty, "Found difference between s3 bucket metrics and the metrics generated outside cqube for district wise crc vists per school "
        print("No Difference between s3 bucket metrics and the metrics generated outside cqube for district wise crc vists per school")



    def tearDown(self):
        self.connection.close()