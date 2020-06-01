import re
import time
import unittest
from selenium import webdriver
from selenium.webdriver import ActionChains

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class district_record(unittest.TestCase):
    def setUp(self):
        dri = pwd()
        self.driver = webdriver.Firefox(executable_path=dri.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()
        driver.navigate_to_semester_report()

    def test_clusterbtn(self):

        self.driver.find_element_by_xpath(Data.SRD17).click()
        time.sleep(1)
        self.driver.find_element_by_xpath(Data.SRB3).click()
        time.sleep(3)
        amccount = self.driver.find_elements_by_class_name(Data.dots)
        cnt = len(amccount)-1
        self.assertNotEqual(0,cnt,msg="failed")
        time.sleep(2)
        driver = cqube(self.driver)
        driver.dots_dist()
        driver.Click_HomeButton()
    def tearDown(self):
        self.driver.close()


if __name__ == "__main__":
    unittest.main()











