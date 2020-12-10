import unittest

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData
from summary_values import summary_records


class Test_summaryreport(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.p = pwd()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.page_loading(self.driver)
        self.data.login_to_adminconsole(self.driver)
        self.driver.find_element_by_xpath(Data.summary_icon).click()
        self.data.page_loading(self.driver)

    def test_student_attendance_summary1(self):
        self.records = summary_records()
        self.data.page_loading(self.driver)
        x = []
        rows = self.driver.find_elements_by_xpath("//*[@id='table1']/tbody/tr[1]/td")
        for i in range(len(rows)):
            x.append(rows[i].text)
        count = 0
        self.data.page_loading(self.driver)
        y = []
        y.append(self.records.get_std_file_name())
        y.append(self.records.get_std_total_records())
        y.append(self.records.get_std_blank_records())
        y.append(self.records.get_duplicate_records())
        y.append(self.records.get_dtypemismatch_records())
        y.append(self.records.get_std_attendance_id_records())
        y.append(self.records.get_std_student_id_records())
        y.append(self.records.get_std_school_id_records())
        y.append(self.records.get_std_year_in_records())
        y.append(self.records.get_std_month_in_records())
        y.append(self.records.get_std_processed_records())

        z = x[:-2]
        if  z == y:
            print('Student attendance summary is fine')
        else:
            print("Some values are mismatching on table ")
            count = count + 1
        self.assertEqual(0,count,msg="Records mismatch found ")
        self.data.page_loading(self.driver)

    # def test_student_attendance_summary2(self):
    #     self.records = summary_records()
    #     self.data.page_loading(self.driver)
    #     x = []
    #     rows = self.driver.find_elements_by_xpath("//*[@id='table1']/tbody/tr[2]/td")
    #     for i in range(len(rows)):
    #         x.append(rows[i].text)
    #     count = 0
    #     self.data.page_loading(self.driver)
    #     y = []
    #     y.append(self.records.get_std_file_name())
    #     y.append(self.records.get_std2_total_records())
    #     y.append(self.records.get_std_blank_records())
    #     y.append(self.records.get_duplicate_records())
    #     y.append(self.records.get_dtypemismatch_records())
    #     y.append(self.records.get_std_attendance_id_records())
    #     y.append(self.records.get_std_student_id_records())
    #     y.append(self.records.get_std_school_id_records())
    #     y.append(self.records.get_std_year_in_records())
    #     y.append(self.records.get_std_month_in_records())
    #     y.append(self.records.get_std2_processed_records())
    #     # y.append(self.records.get_processed_start_records())
    #     # y.append(self.records.get_process_end_records())
    #     z = x[:-2]
    #     if z == y:
    #         print('Student attendance summary is fine')
    #     else:
    #         print("Some values are mismatching on table ")
    #         count = count + 1
    #     self.assertEqual(0, count, msg="Records mismatch found ")
    #     self.data.page_loading(self.driver)
    #
    # def test_student_attendance_summary3(self):
    #     self.records = summary_records()
    #     self.data.page_loading(self.driver)
    #     x = []
    #     rows = self.driver.find_elements_by_xpath("//*[@id='table1']/tbody/tr[3]/td")
    #     for i in range(len(rows)):
    #         x.append(rows[i].text)
    #     count = 0
    #     self.data.page_loading(self.driver)
    #     y = []
    #     y.append(self.records.get_std_file_name())
    #     y.append(self.records.get_std3_total_records())
    #     y.append(self.records.get_std_blank_records())
    #     y.append(self.records.get_duplicate_records())
    #     y.append(self.records.get_dtypemismatch_records())
    #     y.append(self.records.get_std_attendance_id_records())
    #     y.append(self.records.get_std_student_id_records())
    #     y.append(self.records.get_std_school_id_records())
    #     y.append(self.records.get_std_year_in_records())
    #     y.append(self.records.get_std_month_in_records())
    #     y.append(self.records.get_std3_processed_records())
    #     # y.append(self.records.get_processed_start_records())
    #     # y.append(self.records.get_process_end_records())
    #     z = x[:-2]
    #     if z == y:
    #         print('Student attendance summary is fine')
    #     else:
    #         print("Some values are mismatching on table ")
    #         count = count + 1
    #     self.assertEqual(0, count, msg="Records mismatch found ")
    #     self.data.page_loading(self.driver)
    @classmethod
    def tearDownClass(cls):
        cls.driver.close()