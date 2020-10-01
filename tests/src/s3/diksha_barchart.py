import unittest

from reuse_func import GetData


class DikshaBarChart(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.cal = GetData()

    #diksha all folder files

    def test_diksha_all_last_30_days_all_collections(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/all/last_30_days/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("all_collections.json"):
                print("diksha barchart all last 30 days all_collections.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("diksha barchart all last 30 days all_collections.json file is not generated successfully")

    def test_diksha_all_last_30_days_all_district(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/all/last_30_days/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("all_districts.json"):
                print("diksha barchart all last 30 days all_districts.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("diksha barchart all last 30 days all_districts.json file is not generated successfully")
    def test_diksha_all_last_30_days_collection_footer(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/all/last_30_days/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("collection_footer.json"):
                print("diksha barchart all last 30 days collection_footer.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("diksha barchart all last 30 days collection_footer.json file is not generated successfully")

    def test_diksha_all_last_7_days_all_collections(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/all/last_7_days/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("all_collections.json"):
                print("diksha barchart all last 7 days all_collections.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart all last 7 days all_collections.json file is not generated successfully")

    def test_diksha_all_last_7_days_all_district(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/all/last_7_days/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("all_districts.json"):
                print("diksha barchart all last 7 days all_districts.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart all last 7 days all_districts.json file is not generated successfully")

    def test_diksha_all_last_7_days_collection_footer(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/all/last_7_days/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("collection_footer.json"):
                print("diksha barchart all last 7 days collection_footer.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart all last 7 days collection_footer.json file is not generated successfully")

    def test_diksha_all_last_day_all_collections(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/all/last_day/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("all_collections.json"):
                print("diksha barchart all last day all_collections.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart all last day all_collections.json file is not generated successfully")

    def test_diksha_all_last_day_all_district(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/all/last_day/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("all_districts.json"):
                print("diksha barchart all last day all_districts.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart all last day all_districts.json file is not generated successfully")

    def test_diksha_all_last_day_collection_footer(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/all/last_day/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("collection_footer.json"):
                print("diksha barchart all last day collection_footer.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart all last day collection_footer.json file is not generated successfully")

    def test_diksha_all_all_collections(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/all/all_collections.json")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("all_collections.json"):
                print("diksha barchart all all_collections.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart all all_collections.json file is not generated successfully")
    def test_diksha_all_all_districts(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/all/all_districts.json")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("all_districts.json"):
                print("diksha barchart all all_districts.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart all all_districts.json file is not generated successfully")
    def test_diksha_all_collection_footer(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/all/collection_footer.json")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("collection_footer.json"):
                print("diksha barchart all collection_footer.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart all collection_footer.json file is not generated successfully")

    #diksha course folder files
    def test_diksha_course_last_30_days_all_collections(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/course/last_30_days/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("all_collections.json"):
                print("diksha barchart course last 30 days all_collections.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("diksha barchart course last 30 days all_collections.json file is not generated successfully")

    def test_diksha_course_last_30_days_all_district(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/course/last_30_days/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("all_districts.json"):
                print("diksha barchart course last 30 days all_districts.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("diksha barchart course last 30 days all_districts.json file is not generated successfully")
    def test_diksha_course_last_30_days_collection_footer(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/course/last_30_days/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("collection_footer.json"):
                print("diksha barchart course last 30 days collection_footer.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("diksha barchart course last 30 days collection_footer.json file is not generated successfully")

    def test_diksha_course_last_7_days_all_collections(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/course/last_7_days/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("all_collections.json"):
                print("diksha barchart course last 7 days all_collections.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart course last 7 days all_collections.json file is not generated successfully")

    def test_diksha_course_last_7_days_all_district(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/course/last_7_days/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("all_districts.json"):
                print("diksha barchart course last 7 days all_districts.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart course last 7 days all_districts.json file is not generated successfully")

    def test_diksha_course_last_7_days_collection_footer(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/course/last_7_days/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("collection_footer.json"):
                print("diksha barchart course last 7 days collection_footer.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart course last 7 days collection_footer.json file is not generated successfully")

    def test_diksha_course_last_day_all_collections(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/course/last_day/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("all_collections.json"):
                print("diksha barchart course last day all_collections.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart course last day all_collections.json file is not generated successfully")

    def test_diksha_course_last_day_all_district(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/course/last_day/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("all_districts.json"):
                print("diksha barchart course last day all_districts.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart course last day all_districts.json file is not generated successfully")

    def test_diksha_course_last_day_collection_footer(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/course/last_day/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("collection_footer.json"):
                print("diksha barchart course last day collection_footer.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart course last day collection_footer.json file is not generated successfully")
    #diksha textbook files
    def test_diksha_textbook_last_30_days_all_collections(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/textbook/last_30_days/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("all_collections.json"):
                print("diksha barchart textbook last 30 days all_collections.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("diksha barchart textbook last 30 days all_collections.json file is not generated successfully")

    def test_diksha_textbook_last_30_days_all_district(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/textbook/last_30_days/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("all_districts.json"):
                print("diksha barchart textbook last 30 days all_districts.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("diksha barchart textbook last 30 days all_districts.json file is not generated successfully")
    def test_diksha_textbook_last_30_days_collection_footer(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/textbook/last_30_days/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("collection_footer.json"):
                print("diksha barchart textbook last 30 days collection_footer.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException("diksha barchart textbook last 30 days collection_footer.json file is not generated successfully")

    def test_diksha_textbook_last_7_days_all_collections(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/textbook/last_7_days/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("all_collections.json"):
                print("diksha barchart textbook last 7 days all_collections.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart textbook last 7 days all_collections.json file is not generated successfully")

    def test_diksha_textbook_last_7_days_all_district(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/textbook/last_7_days/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("all_districts.json"):
                print("diksha barchart textbook last 7 days all_districts.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart textbook last 7 days all_districts.json file is not generated successfully")

    def test_diksha_textbook_last_7_days_collection_footer(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/textbook/last_7_days/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("collection_footer.json"):
                print("diksha barchart textbook last 7 days collection_footer.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart textbook last 7 days collection_footer.json file is not generated successfully")

    def test_diksha_textbook_last_day_all_collections(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/textbook/last_day/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("all_collections.json"):
                print("diksha barchart textbook last day all_collections.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart textbook last day all_collections.json file is not generated successfully")

    def test_diksha_textbook_last_day_all_district(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/textbook/last_day/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("all_districts.json"):
                print("diksha barchart textbook last day all_districts.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart textbook last day all_districts.json file is not generated successfully")

    def test_diksha_textbook_last_day_collection_footer(self):
        self.diksha = self.cal.get_s3_files("diksha/bar_chart_reports/textbook/last_day/")
        flag = False
        for x in self.diksha:
            if x[len(x) - 1].__contains__("collection_footer.json"):
                print("diksha barchart textbook last day collection_footer.json file generated successfully")
                flag = True
        if flag == False:
            raise self.failureException(
                "diksha barchart textbook last day collection_footer.json file is not generated successfully")

    @classmethod
    def tearDownClass(self):
        print("")
