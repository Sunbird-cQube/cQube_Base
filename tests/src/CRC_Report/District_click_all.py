import time
import unittest

from selenium import webdriver

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class Crc_Reports(unittest.TestCase):
    def setUp(self):
        path_exe = pwd()
        self.driver = webdriver.Firefox(executable_path=path_exe.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()
        driver.navigate_to_crc_report()

    def test_crcclick(self):
        time.sleep(30)
        distnames = self.driver.find_elements_by_xpath(Data.crcdistrict)
        for i in range(len(distnames)):
            distnames[i].click()
            time.sleep(5)
            print(distnames[i].text)

    def tearDown(self):
        self.driver.close()


    if __name__ == "__main__":
        unittest.main()