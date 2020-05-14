import time
import unittest

from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.support.select import Select
# script to click on Gujarat hyperlink which makes refresh
from Data.Paramters import Data


class Hyper_link(unittest.TestCase):
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
        print(self.driver.current_url)
        time.sleep(10)
    def test_hypertext(self):
        self.driver.find_element_by_xpath(Data.Blocks).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.Clusters).click()
        time.sleep(3)
        self.driver.find_element_by_xpath(Data.Schools).click()
        time.sleep(3)

        print(self.driver.find_element_by_xpath(Data.hyper_link).text)
        self.driver.find_element_by_xpath(Data.hyper_link).click()


    def tearDown(self):
            time.sleep(5)
            # print(self.driver.get_screenshot_as_file(""))
            self.driver.close()


if __name__ == "__main__":
    unittest.main()
