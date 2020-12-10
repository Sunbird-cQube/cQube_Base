import time
import unittest

from selenium.webdriver.support.select import Select

from Data.parameters import Data

from Diksha_Reports.Diksha_charts.check_each_districts import district_list
from Diksha_Reports.Diksha_charts.click_on_homeicon import Diksha_homeicon
from Diksha_Reports.Diksha_charts.donwload_the_teacher_file import Diksha_teacher_download
from Diksha_Reports.Diksha_charts.download_overall_file import Diksha_overall_download
from Diksha_Reports.Diksha_charts.download_the_student_file import Diksha_students_download
from Diksha_Reports.Diksha_charts.navigate_to_diskha_chart import Diksha_page
from reuse_func import GetData


class cQube_diskha_chart(unittest.TestCase):

    @classmethod
    def setUpClass(self):
            self.data = GetData()
            self.driver = self.data.get_driver()
            self.data.open_cqube_appln(self.driver)
            self.data.login_cqube(self.driver)
            self.data.navigate_to_diksha_graph()
            self.data.page_loading(self.driver)

    def test_navigate_diksha(self):
        b = Diksha_page(self.driver)
        result = b.test_navigation()
        self.data.page_loading(self.driver)

    def test_click_on_diksha_charticon(self):
        self.driver.find_element_by_id('homeBtn').click()
        self.data.page_loading(self.driver)
        count = 0
        self.driver.find_element_by_id("dsc").click()
        self.data.page_loading(self.driver)
        if "usage-by-user-profile" in self.driver.current_url:
            print("Diksha usage by profile report page is present ")
        else:
            print("Diksha usage by profile page is not exist")
            count = count + 1
        self.assertEqual(0, count, msg="Diksha chart icon is not working ")
        self.data.page_loading(self.driver)

    def test_timeperiods(self):
        self.driver.find_element_by_xpath(Data.hyper_link).click()
        self.data.page_loading(self.driver)
        times = Select(self.driver.find_element_by_name('timePeriod'))
        count = len(times.options) - 1
        for i in range(1, len(times.options)):
            times.select_by_index(i)
            time.sleep(2)
        self.assertNotEqual(0, count, msg="Time periods are not present")
        self.data.page_loading(self.driver)

    def test_all_data_file_donwload(self):
        b = Diksha_overall_download(self.driver)
        res = b.test_overall_file()
        self.assertTrue(res, msg="File is not downloaded")
        self.data.page_loading(self.driver)

    def test_Diksha_students_download(self):
        b = Diksha_students_download(self.driver)
        res = b.test_student_file()
        self.assertTrue(res, msg="File is not downloaded")
        self.data.page_loading(self.driver)

    def test_Diksha_teacher_download(self):
        b = Diksha_teacher_download(self.driver)
        res = b.test_teacher_file()
        self.assertTrue(res, msg="File is not downloaded")
        self.data.page_loading(self.driver)

    def test_Diksha_homeicon(self):
        b = Diksha_homeicon(self.driver)
        res = b.test_homeicon()
        self.assertEqual(res,0,msg="Homeicon is not working ")
        self.data.page_loading(self.driver)

    def test_choosedistricts(self):
        b = district_list(self.driver)
        res = b.test_each_districts()
        self.assertEqual(0,res,msg="Districts are missing ")
        self.data.page_loading(self.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()