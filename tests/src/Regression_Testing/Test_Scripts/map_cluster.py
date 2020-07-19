import csv
import time
import unittest

from selenium import webdriver

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class Map_blocks(unittest.TestCase):
    def setUp(self):
        path_exe = pwd()
        self.driver = webdriver.Chrome(path_exe.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()
        driver.navigate_to_crc_report()

    def test_crcclick(self):
        time.sleep(30)
        dist = self.driver.find_element_by_xpath(Data.CRD5).click()
        self.driver.find_element_by_xpath(Data.CRB10).click()
        time.sleep(10)
        driver = cqube(self.driver)
        driver.clusters_text()
        time.sleep(10)
        xvalues = self.driver.find_elements_by_xpath(Data.xaxis)
        for i in range(len(xvalues)):
            xvalues[i].click()
            time.sleep(3)



    def tearDown(self):

            self.driver.close()

    if __name__ == "__main__":
        unittest.main()