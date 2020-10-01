import time
import unittest
from Data.parameters import Data
from get_dir import pwd
from reuse_func import GetData


class Test_summaryreport(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.p = pwd()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.page_loading(self.driver)
        self.data.login_to_adminconsole(self.driver)

    def test_check_summary_statistics(self):
        self.data.page_loading(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.summ).click()
        self.data.page_loading(self.driver)
        reports =self.driver.find_elements_by_tag_name('h2')
        count = len(reports)
        if "Diksha data Summary:" in self.driver.page_source:
            print('Diksha data Summary: statistics present')
        else:
            print('Diksha data Summary: is not present')

        if "Student Attendance Summary:" in self.driver.page_source:
            print('Student Attendance Summary: present')
        else:
            print('Student Attendance summmary is not present')

        if "CRC Report Summary:" in self.driver.page_source:
            print('CRC Report Summary: statistics present')
        else:
            print('CRC Report Summary: is not present')

        if "Semester Report Summary:" in self.driver.page_source:
            print(' Semester Report Summary: statistics present')
        else:
            print(' Semester Report Summary: is not present')

        if "Infra Report Summary:" in self.driver.page_source:
           print(' Infra Report Summary: statistics present')
        else:
            print(' Infra Report Summary: is not present')

        if "Inspection Report Summary:" in self.driver.page_source:
           print(' Inspection Report Summary: statistics present')
        else:
            print(' Inspection Report Summary: is not present')

        if "Static district file Summary:" in self.driver.page_source:
            print(' Static district file Summary: statistics present')
        else:
            print(' Static district file Summary: is not present')

        if "Static block file Summary:" in self.driver.page_source:
            print(' Static block file Summary: statistics present')
        else:
            print(' Static block file Summary: is not present')

        if "Static cluster file Summary:" in self.driver.page_source:
            print(' Static cluster file Summary: statistics present')
        else:
            print(' Static cluster file Summary: is not present')

        if "Static school file Summary:" in self.driver.page_source:
            print("Static school file Summary: is present ")
        else:
            print("Static school file Summary: is not present ")
        self.data.page_loading(self.driver)

    def test_udise_summary(self):
        self.data.page_loading(self.driver)
        count = 0
        if 'Udise data Summary:' in self.driver.page_source:
            print('Udise summary report table is present ')
        else:
            print('Udise summary is not exist')
            count = count + 1
        self.assertEqual(0,count,msg='Udise summary is missing in Summary Statistics ')
        self.data.page_loading(self.driver)



    @classmethod
    def tearDownClass(cls):
        cls.driver.close()