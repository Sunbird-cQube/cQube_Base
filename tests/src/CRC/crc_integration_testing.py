import unittest
import time

from Data.parameters import Data
from reuse_func import GetData


class cQube_CRC_Report(unittest.TestCase):

    @classmethod
    def setUpClass(self):
            self.total_tests =25
            self.tests = [0] * 26
            self.data = GetData()
            self.logger = self.data.get_integration_log()
            self.driver = self.data.get_driver()
            self.data.open_cqube_appln(self.driver)
            self.data.login_cqube(self.driver)
            self.data.navigate_to_crc_report()
            self.data.page_loading(self.driver)

    def test_dashboard_crc(self):
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.CRC).click()
        self.data.page_loading(self.driver)
        if "crc-report" in self.driver.current_url:
            print("crc report page is present")
        else:
            print("crc report is not exist")
        self.data.page_loading(self.driver)

    def test_home(self):
        self.driver.find_element_by_id("homeBtn").click()
        if "home" in self.driver.current_url:
            print("Home page of cQube is displayed")
        else:
            print("cQube home page is not displayed")
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.CRC).click()
        self.data.page_loading(self.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
