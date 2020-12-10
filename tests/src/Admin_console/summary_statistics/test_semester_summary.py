import unittest

from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData
from summary_values import summary_records


class Test_semester_summary(unittest.TestCase):

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

    def test_semester_file_summary(self):
        self.records = summary_records()
        self.data.page_loading(self.driver)
        x = []
        rows = self.driver.find_elements_by_xpath("//*[@id='table2']/tbody/tr[2]/td")
        for i in range(len(rows)):
            x.append(rows[i].text)
        count = 0
        self.data.page_loading(self.driver)
        y = []
        y.append(self.records.get_semester_file_name())
        y.append(self.records.get_sem_total_records())
        y.append(self.records.get_sem_blank_records())
        y.append(self.records.get_sem_duplicate_records())
        y.append(self.records.get_sem_dtypemismatch_records())
        y.append(self.records.get_sem_student_id_records())
        y.append(self.records.get_sem_school_id_records())
        y.append(self.records.get_sem_semester_records())
        y.append(self.records.get_sem_grade_records())
        y.append(self.records.get_sem_processed_records())
        z = x[:-2]
        print('Screen showing',z)
        print('In config file',y)
        if  z == y:
            print('Semester attendance summary is fine')
        else:
            print("Some values are mismatching on table ")
            count = count + 1
        self.assertEqual(0,count,msg="Records mismatch found ")
        self.data.page_loading(self.driver)