import unittest
from reuse_func import GetData


class DikshaTableReport(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.cal = GetData()

    #diksha table report all files
    def test_diksha_table_report_all_files(self):
        all_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_table_report_all_files("all")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                all_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, all_files_in_s3, "files are missing")

    def test_diksha_table_report_all_last_30_days_files(self):
        all_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_table_report_files("last_30_days")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                all_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, all_files_in_s3, "files are missing")
    def test_diksha_table_report_all_last_7_days_files(self):
        all_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_table_report_files("last_7_days")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                all_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, all_files_in_s3, "files are missing")
    def test_diksha_table_report_all_last_day_files(self):
        all_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_table_report_files("last_day")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                all_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, all_files_in_s3, "files are missing")

    #diksha table report course
    
    def test_diksha_table_report_course_files(self):
        course_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_table_report_all_files("course")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                course_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, course_files_in_s3, "files are missing")

    def test_diksha_table_report_course_last_30_days_files(self):
        course_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_table_report_files("last_30_days")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                course_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, course_files_in_s3, "files are missing")
    def test_diksha_table_report_course_last_7_days_files(self):
        course_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_table_report_files("last_7_days")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                course_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, course_files_in_s3, "files are missing")
    def test_diksha_table_report_course_last_day_files(self):
        course_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_table_report_files("last_day")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                course_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, course_files_in_s3, "files are missing")

    # diksha table report textbook

    def test_diksha_table_report_textbook_files(self):
        textbook_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_table_report_all_files("textbook")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                textbook_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, textbook_files_in_s3, "files are missing")

    def test_diksha_table_report_textbook_last_30_days_files(self):
        textbook_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_table_report_files("last_30_days")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                textbook_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, textbook_files_in_s3, "files are missing")

    def test_diksha_table_report_textbook_last_7_days_files(self):
        textbook_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_table_report_files("last_7_days")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                textbook_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, textbook_files_in_s3, "files are missing")

    def test_diksha_table_report_textbook_last_day_files(self):
        textbook_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_table_report_files("last_day")
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                textbook_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, textbook_files_in_s3, "files are missing")