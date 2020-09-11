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
        district = SemesterException()
        df1 = pd.read_sql_query(district.district_wise, self.connection)
        df1=df1[['district_id','district_name','total_schools']]
        df1.sort_values(by=['district_id'], inplace=True)
        pd.set_option("display.max_rows", None, "display.max_columns", None)

        file = cqube()
        result=file.openfile(config['jsondata']['semester_exception_district_wise'])
        df2=pd.DataFrame(result['data'])
        df2=df2[['district_id','district_name','total_schools']]
        df2['total_schools']=df2['total_schools'].astype(float)
        df2.sort_values(by=['district_id'], inplace=True)

        df_diff = pd.concat([df1, df2]).drop_duplicates(keep=False)
        assert df_diff.empty , "Found difference between s3 bucket metrics and the metrics generated outside cqube for district wise total_schools "
        print("No Difference between s3 bucket metrics and the metrics generated outside cqube for district wise total_schools for semester exception")

    def tearDown(self):
        self.connection.close()
