

import time
import unittest

from selenium import webdriver
from selenium.webdriver import ActionChains

from Data.Paramters import Data
from Testscripts.login_page import Home_page

#script to Regular User

class Regular_user(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome(Data.Path)
        self.driver.maximize_window()
        self.driver.implicitly_wait(10)
        self.driver.get(Data.URL)

    def test_RegularUsr(self):
        print(self.driver.title)
        self.driver.find_element_by_xpath(Data.reg_user).click()
        time.sleep(10)
        print(self.driver.title)

    def tearDown(self):
        print(self.driver.current_url)
        time.sleep(5)
        # print(self.driver.get_screenshot_as_file(""))
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
