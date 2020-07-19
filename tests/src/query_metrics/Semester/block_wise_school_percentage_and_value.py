import configparser
import time
import unittest
import pandas as pd
from Queries.test_query import TestQuery
from TS.reuse_func import cqube
from get_dir import pwd

p = pwd()
config = configparser.ConfigParser()
config.read(p.get_json_data_ini_path())

class Semester(unittest.TestCase):
    def setUp(self):
        con = cqube()
        self.connection = con.connect_to_postgres()

    def test_query(self):
        block = TestQuery()
        df1 = pd.read_sql_query(block.block_wise_semester, self.connection)
        df1 = df1[['block_name','value_below_33', 'value_between_33_60',
                   'value_between_60_75', 'value_above_75', 'percent_below_33',
                   'percent_between_33_60', 'percent_between_60_75', 'percent_above_75']]
        df2 = pd.read_json(config['jsondata']['block_semester'])

        df2 = df2[['block_name','value_below_33', 'value_between_33_60',
       'value_between_60_75', 'value_above_75', 'percent_below_33',
       'percent_between_33_60', 'percent_between_60_75', 'percent_above_75']]
        df_diff = pd.concat([df1, df2]).drop_duplicates(keep=False)
        assert df_diff.empty , "Found difference between s3 bucket metrics and the metrics generated outside cqube for block wise school percentage and values "
        print("No Difference between s3 bucket metrics and the metrics generated outside cqube for block wise school percentage and values ")

    def tearDown(self):
        self.connection.close()