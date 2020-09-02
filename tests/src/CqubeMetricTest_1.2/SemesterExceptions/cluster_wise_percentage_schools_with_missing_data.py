import configparser
import unittest
import pandas as pd
from Queries.test_semester_exceptions import SemesterException
from reuse_func import cqube
from get_dir import pwd

p = pwd()
config = configparser.ConfigParser()
config.read(p.get_json_data_ini_path())


class Semester(unittest.TestCase):
    def setUp(self):
        con = cqube()
        self.connection = con.connect_to_postgres()

    def test_metrics(self):
        print("")
        cluster = SemesterException()
        df1 = pd.read_sql_query(cluster.cluster_wise, self.connection)
        df1=df1[['cluster_id', 'cluster_name','percentage_schools_with_missing_data']]
        df1.sort_values(by=['cluster_id'], inplace=True)
        pd.set_option("display.max_rows", None, "display.max_columns", None)
        file = cqube()
        result=file.openfile(config['jsondata']['semester_exception_cluster_wise'])
        df2=pd.DataFrame(result['data'])
        df2=df2[['cluster_id', 'cluster_name','percentage_schools_with_missing_data']]
        df2['percentage_schools_with_missing_data']=df2['percentage_schools_with_missing_data'].astype(float)
        df2.sort_values(by=['cluster_id'], inplace=True)

        df_diff = pd.concat([df1, df2]).drop_duplicates(keep=False)
        assert df_diff.empty , "Found difference between s3 bucket metrics and the metrics generated outside cqube for block_wise percentage_schools_with_missing_data "
        print("No Difference between s3 bucket metrics and the metrics generated outside cqube for block wise percentage_schools_with_missing_data for semester exception")


    def tearDown(self):
        self.connection.close()
