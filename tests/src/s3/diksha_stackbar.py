import unittest

from reuse_func import GetData


class DikshaStackBar(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.cal = GetData()

    def test_diksha_stack_bar_all_files(self):
        all_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_stackbar_all_list()
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                all_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, all_files_in_s3, "files are missing")

    def test_diksha_stack_bar_last_30_days_files(self):
        all_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_stackbar_last_30_days_list()
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                all_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, all_files_in_s3, "files are missing")

    def test_diksha_stack_bar_last_7_days_files(self):
        all_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_stackbar_last_7_days_list()
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                all_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, all_files_in_s3, "files are missing")

    def test_diksha_stack_bar_last_day_files(self):
        all_files_in_s3 = []
        bucket = self.cal.get_bucket()
        comparision_files = self.cal.get_stackbar_last_day_list()
        for x in comparision_files:
            for key in bucket.list(prefix=x, delimiter='*.json'):
                all_files_in_s3.append(key.name)
        self.assertListEqual(comparision_files, all_files_in_s3, "files are missing")

    # self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/all/last_30_days/")
    # flag = False
    # for x in self.diksha:
    #     if x[len(x) - 1].__contains__("all_collections.json"):
    #         print("diksha barchart all last 30 days all_collections.json file generated successfully")
    #         flag = True
    # if flag == False:
    #     raise self.failureException("diksha barchart all last 30 days all_collections.json file is not generated successfully")
