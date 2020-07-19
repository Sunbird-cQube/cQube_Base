import time
import unittest

from selenium import webdriver

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class Xaxis(unittest.TestCase):
    def setUp(self):
        path_exe = pwd()
        self.driver = webdriver.Chrome(path_exe.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()
        driver.navigate_to_crc_report()

    def test_click_xaxis(self):

        time.sleep(30)
        xaxis_lists =self.driver.find_elements_by_xpath(Data.xaxis)
        for i in range(len(xaxis_lists)):
            xaxis_lists[i].click()
            print(xaxis_lists[i].text)
            time.sleep(5)
    def tearDown(self):
            time.sleep(5)
            self.driver.close()

    if __name__ == "__main__":
        unittest.main()