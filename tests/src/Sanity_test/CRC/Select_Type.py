import time
import unittest

from selenium import webdriver

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class Sel_type(unittest.TestCase):
    def setUp(self):
        path_exe = pwd()
        self.driver = webdriver.Chrome(path_exe.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()
        driver.navigate_to_crc_report()

    def test_select_for_download(self):

        time.sleep(30)
        sel_type =self.driver.find_elements_by_xpath(Data.selecttype)
        time.sleep(5)
        count = len(sel_type)
        print(count)
        for i in range(len(sel_type)):
            sel_type[i].click()
            print(sel_type[i].text)
            time.sleep(3)


    def tearDown(self):
            time.sleep(5)
            self.driver.close()

    if __name__ == "__main__":
        unittest.main()