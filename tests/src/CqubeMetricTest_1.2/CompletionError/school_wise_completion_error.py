import configparser
import unittest
import pandas as pd
import glob
import json

from Queries.test_completion_error import CompletionError
from Queries.test_diksha_column_chart import DikshaColumnChart
from Queries.test_diksha_stacked_bar import DikshaStacked
from Queries.test_diksha_table import DikshaTableReport
from reuse_func import cqube
from get_dir import pwd

p = pwd()
config = configparser.ConfigParser()
config.read(p.get_json_data_ini_path())


class CompletionErrorReport(unittest.TestCase):
    def setUp(self):
        con = cqube()
        self.connection = con.connect_to_postgres()

    def test_metrics(self):
        print("")
        query = CompletionError()
        df1 = pd.read_sql_query(query.school,self.connection)
        df1=df1[['ff_uuid', 'exception_type', 'school_id', 'school_name', 'block_id',
       'district_id', 'cluster_id', 'school_latitude', 'school_longitude',
       'created_on']]
        df1.sort_values(by=['school_id'], inplace=True)
        pd.set_option("display.max_rows", None, "display.max_columns", None)
        print(df1.count())

        file = cqube()
        result = file.openfile(config['jsondata']['exception_list'])
        df2 = pd.DataFrame(result)

        df2 = df2[['ff_uuid', 'exception_type', 'school_id', 'school_name', 'block_id',
               'district_id', 'cluster_id', 'school_latitude', 'school_longitude',
               'created_on']]
        df2.sort_values(by=['school_id'], inplace=True)
        df_diff = pd.concat([df1, df2]).drop_duplicates(keep=False)
        assert df_diff.empty, "Found difference between s3 bucket metrics and the metrics generated outside cqube for school wise completion error "
        print(
            "No Difference between s3 bucket metrics and the metrics generated outside cqube for school wise completion error")



    def tearDown(self):
        self.connection.close()
