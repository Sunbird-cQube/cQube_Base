import time
import unittest

from selenium import webdriver
from selenium.webdriver.support.select import Select

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class Fillup_user(unittest.TestCase):
    def setUp(self):
        path_exe = pwd()
        self.driver = webdriver.Firefox(executable_path=path_exe.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()

    def test_filling(self):
        self.driver.find_element_by_xpath(Data.Dashboard).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.user).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.create_user).click()
        time.sleep(2)
        header = self.driver.find_element_by_xpath(Data.create_headtext).text
        self.assertEqual(header,"Create User","Create user not found!..")
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.fname).send_keys("Demo")
        self.driver.find_element_by_xpath(Data.mname).send_keys("D")
        self.driver.find_element_by_xpath(Data.lname).send_keys("sample")
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.male).click()
        self.driver.find_element_by_xpath(Data.mail).send_keys("example@cqube.com")
        self.driver.find_element_by_xpath(Data.designation).send_keys("Software Professional")
        self.driver.find_element_by_xpath(Data.confpass).send_keys("abcd123")
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.admin).click()
        time.sleep(3)
        
    def tearDown(self):
            self.driver.close()

if __name__ == "__main__":
        unittest.main()