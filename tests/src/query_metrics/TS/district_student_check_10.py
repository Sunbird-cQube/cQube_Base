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


class SAR(unittest.TestCase):
    def setUp(self):
       con = cqube()
       self.connection = con.connect_to_postgres()

    def test_query(self):
        district = TestQuery()
        df1 = pd.read_sql_query(district.district_wise_10, self.connection)
        df2 = pd.read_json(config['jsondata']['district_attendance_2019_10'])
        df2 = df2[['students_count', 'total_schools', 'district_name']]
        df_diff = pd.concat([df1, df2]).drop_duplicates(keep=False)
        assert df_diff.empty , "Found difference between s3 bucket metrics and the metrics generated outside cqube for district wise student attendance for october"
        print("No Difference between s3 bucket metrics and the metrics generated outside cqube for district wise student attendance 'student_count','total_schools','block_name' for october")



    def tearDown(self):
        self.connection.close()