
import unittest
import time
from Data.parameters import Data
from reuse_func import GetData

class cQube_School_map_integration_Test(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        self.data = GetData()
        self.driver = self.data.get_driver()
        self.data.open_cqube_appln(self.driver)
        self.data.login_cqube(self.driver)
        self.driver.find_element_by_id(Data.Dashboard).click()
        self.driver.find_element_by_xpath(Data.School_infra).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.Reportmap).click()
        self.driver.implicitly_wait(35)
        self.data.page_loading(self.driver)

    def test_navigate_to_sar(self):
        self.data.page_loading(self.driver)
        if "semester-report" in self.driver.current_url:
            print("Semester report is present ")
        else:
            print("Semester report is not present ")
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
        self.data.page_loading(self.driver)
        time.sleep(10)
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
        self.driver.find_element_by_xpath(Data.School_infra).click()
        time.sleep(2)
        self.driver.find_element_by_id(Data.Reportmap).click()
        self.data.page_loading(self.driver)



    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
