
import unittest
import time
from Data.parameters import Data
from reuse_func import GetData

class cQube_sar_integration_Test(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.total_tests = 1
        self.tests = [0] * 2
        self.data = GetData()
        self.logger = self.data.get_integration_log()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.driver.find_element_by_id(Data.SAR).click()
        self.data.page_loading(self.driver)

    def test_navigate_to_sar(self):

        self.data.page_loading(self.driver)
        if "attendance-report" in self.driver.current_url:
            print("Student attendance report is present ")
        else:
            print("Student attendance is not present ")
        self.driver.find_element_by_id(Data.Dashboard).click()

    def test_click_on_blocks(self):
        self.driver.find_element_by_id("block").click()
        self.data.page_loading(self.driver)
        print("block button is working fine")
        dots = self.driver.find_elements_by_class_name(Data.dots)
        self.assertNotEqual(0,len(dots)-1,msg="markers are not present on map ")
        self.data.page_loading(self.driver)

    def test_click_on_cluster(self):
        self.driver.find_element_by_id("cluster").click()
        self.data.page_loading(self.driver)
        print("cluster button is working fine")
        dots = self.driver.find_elements_by_class_name(Data.dots)
        self.assertNotEqual(0,len(dots)-1,msg="markers are not present on map ")
        self.data.page_loading(self.driver)

    def test_click_on_schools(self):
        self.driver.find_element_by_id("school").click()
        # self.data.page_loading(self.driver)
        time.sleep(25)
        print("school button is working fine")
        dots = self.driver.find_elements_by_class_name(Data.dots)
        self.assertNotEqual(0,len(dots)-1,msg="markers are not present on map ")
        self.data.page_loading(self.driver)

    def test_homebutton(self):
        self.driver.find_element_by_id("homeBtn").click()
        self.data.page_loading(self.driver)
        if "home" in self.driver.current_url:
            print("home page is present")
        else:
            print("home page is not present ")
        self.driver.find_element_by_id(Data.Dashboard).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.SAR).click()
        self.data.page_loading(self.driver)

    # def test_logout(self):
    #     self.driver.find_element_by_id(Data.logout).click()
    #     self.data.page_loading(self.driver)
    #     if "login" in self.driver.current_url:
    #         print("login page is present")
    #     else:
    #         print("login page is not present")
    #     self.data.page_loading(self.driver)
    #     self.driver.find_element_by_id(Data.Dashboard).click()
    #     time.sleep(2)
    #     self.driver.find_element_by_id(Data.SAR).click()
    #     self.data.page_loading(self.driver)


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
