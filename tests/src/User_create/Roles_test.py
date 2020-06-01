import time
import unittest

from selenium import webdriver
from selenium.webdriver.support.select import Select

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class select_each_roles(unittest.TestCase):
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
        self.assertEqual(header, "Create User", "Create user not found!..")
        time.sleep(2)
        roles = self.driver.find_elements_by_xpath(Data.rolesoptions)
        for i in range(len(roles)):
            roles[i].click()
            time.sleep(2)
            print(roles[i].text)
            time.sleep(3)


    def tearDown(self):
        time.sleep(5)
        self.driver.close()


if __name__ == "__main__":
    unittest.main()