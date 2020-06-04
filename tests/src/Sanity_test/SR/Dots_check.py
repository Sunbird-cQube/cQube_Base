
import csv
import time
import unittest

from selenium import webdriver

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class validate_clicking_function(unittest.TestCase):
    def setUp(self):
        dri = pwd()
        self.driver = webdriver.Chrome(dri.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()
        driver.navigate_to_semester_report()
    def test_validate_District(self):
        time.sleep(5)
        self.driver.find_element_by_xpath(Data.SRD29).click()
        self.driver.find_element_by_xpath(Data.Download).click()
        time.sleep(10)
        lists = self.driver.find_elements_by_class_name(Data.dots)
        count = len(lists)-1
        self.assertNotEqual(0,count,msg="Failed")
    def tearDown(self):
            time.sleep(5)
            self.driver.close()

if __name__ == "__main__":
        unittest.main()