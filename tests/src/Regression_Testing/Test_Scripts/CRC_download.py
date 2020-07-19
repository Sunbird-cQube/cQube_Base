import csv
import time
import unittest

from selenium import webdriver

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class Crc_Reports(unittest.TestCase):
    def setUp(self):
        path_exe = pwd()
        self.driver = webdriver.Chrome(path_exe.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()
        driver.navigate_to_crc_report()

    def test_crcclick(self):

        time.sleep(30)
        self.driver.find_element_by_xpath(Data.Download_icon).click()
        time.sleep(5)

    def tearDown(self):
            time.sleep(5)
            self.driver.close()

    if __name__ == "__main__":
        unittest.main()