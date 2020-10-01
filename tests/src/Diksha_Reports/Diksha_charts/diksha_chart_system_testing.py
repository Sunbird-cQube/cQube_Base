
import time
import unittest

from selenium.webdriver.support.select import Select
from Data.parameters import Data
from reuse_func import GetData
from Diksha_Reports.Diksha_charts.donwload_the_teacher_file import Diksha_teacher_download
from Diksha_Reports.Diksha_charts.download_overall_file import Diksha_overall_download
from Diksha_Reports.Diksha_charts.download_the_others_file import Diksha_others_download

from Diksha_Reports.Diksha_charts.download_the_student_file import Diksha_students_download
from Diksha_Reports.Diksha_charts.navigate_to_diskha_chart import Diksha_page


class cQube_diskha_chart(unittest.TestCase):

    @classmethod
    def setUpClass(self):
            self.data = GetData()
            self.driver = self.data.get_driver()
            self.driver.implicitly_wait(50)
            self.data.open_cqube_appln(self.driver)
            self.data.login_cqube(self.driver)
            self.data.navigate_to_diksha_graph()
            self.data.page_loading(self.driver)

    def test_navigate_diksha(self):
        b = Diksha_page(self.driver)
        result = b.test_navigation()
        self.data.page_loading(self.driver)

    def test_timeperiods(self):
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        times =Select(self.driver.find_element_by_name('timePeriod'))
        count =len(times.options ) - 1
        for i in range(1,len(times.options)):
            times.select_by_index(i)
            time.sleep(2)
        self.assertNotEqual(0,count,msg="Time periods are not present")
        self.data.page_loading(self.driver)

    def test_all_data_file_donwload(self):
        b = Diksha_overall_download(self.driver)
        res = b.test_overall_file()
        self.assertTrue(res, msg="All data csv file is downloaded")
        self.data.page_loading(self.driver)

    def test_Diksha_students_download(self):
        b = Diksha_students_download(self.driver)
        res = b.test_student_file()
        self.assertTrue(res, msg="student data csv file is downloaded")
        self.data.page_loading(self.driver)


    def test_Diksha_teacher_download(self):
        b = Diksha_teacher_download(self.driver)
        res = b.test_teacher_file()
        self.assertTrue(res, msg="teacher data csv file is downloaded")
        self.data.page_loading(self.driver)

    def test_Diksha_others_download(self):
        b = Diksha_others_download(self.driver)
        res = b.test_others_file()
        self.assertTrue(res, msg="Others data csv file is downloaded")
        self.data.page_loading(self.driver)


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()

