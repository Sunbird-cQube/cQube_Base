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
        time.sleep(35)
        dist = self.driver.find_element_by_xpath(Data.CRD8).click()


        blocks = self.driver.find_elements_by_xpath(Data.blockslist)
        for i in range(len(blocks)):
            blocks[i].click()
            print(blocks[i].text)
            time.sleep(4)
        time.sleep(3)
        driver = cqube(self.driver)
        driver.X_axis()


    def tearDown(self):
            time.sleep(5)
            self.driver.close()

    if __name__ == "__main__":
        unittest.main()