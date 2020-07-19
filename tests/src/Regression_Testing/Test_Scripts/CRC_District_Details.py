import time
import unittest

from selenium import webdriver

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class crc_report(unittest.TestCase):
    def setUp(self):
        path_exe = pwd()
        self.driver = webdriver.Chrome(path_exe.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()
        driver.navigate_to_crc_report()
    def test_crcclick(self):
        time.sleep(40)
        self.driver.find_element_by_xpath(Data.CRD1).click()
        time.sleep(5)
        driver = cqube(self.driver)
        driver.CRC_footers()

    def tearDown(self):
      self.driver.close()

    if __name__ == "__main__":
        unittest.main()