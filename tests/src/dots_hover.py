import time
import unittest

from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.support.select import Select
# script to choose district , block ,cluster
from Data.Paramters import Data


class Dist_5(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome(Data.Path)
        self.driver.maximize_window()
        self.driver.implicitly_wait(10)
        self.driver.get(Data.URL)

        print(self.driver.title)
        self.driver.find_element_by_xpath(Data.email).send_keys(Data.username)
        self.driver.find_element_by_xpath(Data.pwd).send_keys(Data.password)
        self.driver.find_element_by_xpath(Data.loginbtn).click()
        time.sleep(10)
    def test_dist5(self):
        print(self.driver.current_url)
        self.driver.find_element_by_xpath(Data.dist5).click()


    def tearDown(self):
            time.sleep(5)
            # print(self.driver.get_screenshot_as_file(""))
            self.driver.close()


if __name__ == "__main__":
    unittest.main()
