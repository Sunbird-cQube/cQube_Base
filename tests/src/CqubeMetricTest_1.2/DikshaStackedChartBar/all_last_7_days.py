import configparser
import os
import unittest
import pandas as pd
import glob
import json
from Queries.test_diksha_stacked_bar import DikshaStacked
from reuse_func import cqube
from get_dir import pwd

p = pwd()
config = configparser.ConfigParser()
config.read(p.get_json_data_ini_path())


class DikshaStackedReport(unittest.TestCase):
    def setUp(self):
        con = cqube()
        self.connection = con.connect_to_postgres()

    def test_metrics(self):
        print("")
        last_7_days = DikshaStacked()
        df1 = pd.read_sql_query(last_7_days.overall_usage_last_7_days, self.connection)
        df1 = df1[['district_id', 'district_name', 'user_login_type', 'content_gradelevel',
       'content_subject', 'total_content_plays']]
        df1.sort_values(by=['district_id'], inplace=True)
        path = config['jsondata']['stack_bar_reports_last_7_days']
        files = glob.glob(path)
        list = []
        for f1 in files:
            with open(f1, "r") as file:
                txt = os.path.basename(f1)
                txt=txt.split(".")
                test=txt[0]
                json_data = json.load(file)
                for x in json_data[test]['All']:
                    list.append(x)
                for x in json_data[test]['Teacher']:
                    list.append(x)
                for x in json_data[test]['Other']:
                    list.append(x)
                for x in json_data[test]['Student']:
                    list.append(x)
        # print(list)
        df2 = pd.DataFrame(list)
        df2 = df2[['district_id', 'district_name', 'user_login_type', 'content_gradelevel',
                   'content_subject', 'total_content_plays']]
        df2['total_content_plays'] = df2['total_content_plays'].astype(float)
        df1.sort_values(by=['district_id'], inplace=True)
        df_diff = pd.concat([df1, df2]).drop_duplicates(keep=False)
        assert df_diff.empty, "Found difference between s3 bucket metrics and the metrics generated outside cqube for diksha stacked bar chart  "
        print(
            "No Difference between s3 bucket metrics and the metrics generated outside cqube for diksha stacked bar chart ")


    def tearDown(self):
        self.connection.close()
