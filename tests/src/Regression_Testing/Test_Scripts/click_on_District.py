import re
import time
import unittest
from selenium import webdriver
from selenium.webdriver import ActionChains

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class District_test(unittest.TestCase):
    def setUp(self):
        dri = pwd()
        self.driver = webdriver.Chrome(dri.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()
        driver.navigate_to_semester_report()


    def test_clusterbtn(self):
        print(self.driver.title)
        time.sleep(5)
        self.driver.find_element_by_xpath(Data.SRD9).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.SRB4).click()
        time.sleep(8)
        driver = cqube(self.driver)
        driver.dots_dist()
        driver.Click_HomeButton()
    def tearDown(self):
        time.sleep(5)
        self.driver.close()


if __name__ == "__main__":
    unittest.main()











