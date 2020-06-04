import time
import unittest

from selenium import webdriver

from Data.Paramters import Data
from Testscripts.login_page import Home_page

#script to click on download report button
class Report_download(unittest.TestCase):
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

    def test_download_icon(self):
        self.driver.find_element_by_xpath(Data.Download).click()
        print(self.driver.current_url)

    def tearDown(self):
        time.sleep(5)
        # print(self.driver.get_screenshot_as_file(""))
        self.driver.close()

if __name__ == "__main__":
       unittest.main()
