
import time
import unittest
from selenium import webdriver
from selenium.webdriver import ActionChains

from Data.Paramters import Data
from Testscripts.login_page import Home_page

#script to click on home_button

class Homebtn_click(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome(Data.Path)
        self.driver.maximize_window()
        self.driver.implicitly_wait(10)
        self.driver.get(Data.URL)

    def test_login(self):
        print(self.driver.title)
        self.driver.find_element_by_xpath(Data.email).send_keys(Data.username)
        self.driver.find_element_by_xpath(Data.pwd).send_keys(Data.password)
        self.driver.find_element_by_xpath(Data.loginbtn).click()
        time.sleep(10)
    def click_on_blocks(self):
        self.driver.find_elements_by_xpath(Data.Blocks).click()
    def ClickOn_HomeButton(self):
            self.driver.find_element_by_id(Data.Home_icon).click()
            print(self.driver.current_url)

    def tearDown(self):
        time.sleep(5)
        # print(self.driver.get_screenshot_as_file(""))
        self.driver.close()

if __name__ == "__main__":
    unittest.main()

