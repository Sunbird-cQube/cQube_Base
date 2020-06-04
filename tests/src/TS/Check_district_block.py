import csv
import re
import time
import unittest

from selenium import webdriver

from Data.parameters import Data
from TS.arg import arg
from TS.reuse_func import cqube
from get_dir import pwd


class block_validation(unittest.TestCase):
    def setUp(self):
        driver_path = pwd()
        self.driver = webdriver.Firefox(executable_path=driver_path.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver = cqube(self.driver)
        driver.login_cqube()
        driver.navigate_to_student_report()
        x = arg()
        #driver.select_month_year(x.list[0], x.list[1])

    def test_validate_block(self):

        self.driver.find_element_by_xpath(Data.SARD2).click()
        self.driver.find_element_by_xpath(Data.SARB1).click()
        self.driver.find_element_by_xpath(Data.SARC1).click()
        time.sleep(5)
        lists = self.driver.find_elements_by_class_name(Data.dots)
        count = len(lists)
        self.assertNotEqual(0, count, msg="Failed")
        no_schools = self.driver.find_element_by_xpath(Data.No_schools).text
        str = no_schools
        res = re.sub("\D", "", str)
        self.assertEqual(count, int(res), msg="Number of Dots and Number of schools are mis matched")

    def tearDown(self):
            time.sleep(5)
            self.driver.close()

if __name__ == "__main__":
        unittest.main()