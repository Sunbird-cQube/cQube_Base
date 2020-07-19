import time
import unittest

from selenium import webdriver

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class Yaxis(unittest.TestCase):
    def setUp(self):
        path_exe = pwd()
        self.driver = webdriver.Chrome(path_exe.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()
        driver.navigate_to_crc_report()

    def test_click_yaxis(self):
        self.driver.find_element_by_xpath(Data.Dashboard).click()
        self.driver.find_element_by_xpath(Data.crc).click()
        time.sleep(30)
        yaxis_lists =self.driver.find_elements_by_xpath(Data.yaxis)
        for i in range(len(yaxis_lists)):
            yaxis_lists[i].click()
            print(yaxis_lists[i].text)
            time.sleep(10)



    def tearDown(self):
            time.sleep(5)
            self.driver.close()

    if __name__ == "__main__":
        unittest.main()