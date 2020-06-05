import configparser
import time
import unittest
import pandas as pd
import requests
from pandas.util.testing import assert_frame_equal, assert_almost_equal

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
        block = CRC_Query()
        df1 = pd.read_sql_query(block.blockwise_crc, self.connection)
        block1 = crc_get_data()
        df2 = pd.DataFrame.from_records(block1.dist_wise_crc(config['url']['domain']+'crc/allBlockWise')['visits'])
        df2.columns = map(str.lower, df2.columns)
        df2 = df2[['blockname', 'blockid', 'no_of_schools_per_crc', 'visits_per_school','totalschools']]
        df2['no_of_schools_per_crc']=df2['no_of_schools_per_crc'].astype(float)
        df2['visits_per_school'] = df2['visits_per_school'].astype(float)
        df_diff = pd.concat([df1, df2]).drop_duplicates(keep=False)
        assert df_diff.empty, "Found difference between s3 bucket metrics and the metrics generated outside cqube for block wise crc schools "
        print("No Difference between s3 bucket metrics and the metrics generated outside cqube for block wise crc schools")



    def tearDown(self):
        self.connection.close()