import csv
import time
import unittest

from selenium import webdriver

from Data.parameters import Data
from TS.arg import arg
from TS.reuse_func import cqube
from get_dir import pwd


class District_validation(unittest.TestCase):
    def setUp(self):
        driver_path = pwd()
        self.driver = webdriver.Chrome(driver_path.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver = cqube(self.driver)
        driver.login_cqube()
        driver.navigate_to_student_report()

    def test_validate_blockrecords(self):
        time.sleep(5)
        self.driver.find_element_by_xpath(Data.SARD1).click()
        self.driver.find_element_by_xpath(Data.SARB1).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.Download).click()
        time.sleep(4)
        lists = self.driver.find_elements_by_class_name(Data.dots)
        count = len(lists)-1
        self.assertNotEqual(0,count,msg="dots are mismatched")
    def tearDown(self):
            time.sleep(5)
            self.driver.close()

if __name__ == "__main__":
        unittest.main()