import time
import unittest

from selenium import webdriver

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class Click_create(unittest.TestCase):
    def setUp(self):
        path_exe = pwd()
        self.driver = webdriver.Firefox(executable_path=path_exe.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()

    def test_userlink(self):
        self.driver.find_element_by_xpath(Data.Dashboard).click()
        time.sleep(1)
        self.driver.find_element_by_xpath(Data.user).click()
        time.sleep(1)
        self.driver.find_element_by_xpath(Data.create_user).click()
        time.sleep(1)
        header = self.driver.find_element_by_xpath(Data.create_headtext).text
        self.assertEqual(header,"Create User","Create user not found!..")

    def tearDown(self):
            self.driver.close()

if __name__ == "__main__":
        unittest.main()