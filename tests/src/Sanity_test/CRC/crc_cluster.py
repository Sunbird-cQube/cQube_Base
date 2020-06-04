import csv
import time
import unittest
import re

from selenium import webdriver

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class cluster_test(unittest.TestCase):
    def setUp(self):
        path_exe = pwd()
        self.driver = webdriver.Chrome(path_exe.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()
        driver.navigate_to_crc_report()

    def test_crcclick(self):
        time.sleep(40)
        dist = self.driver.find_element_by_xpath(Data.CRD16).click()
        block = self.driver.find_element_by_xpath(Data.CRB7).click()
        time.sleep(5)
        self.driver.find_element_by_xpath(Data.CRC2).click()
        time.sleep(5)


    def tearDown(self):
        self.driver.close()

    if __name__ == "__main__":
        unittest.main()