import time
import unittest

from selenium import webdriver

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class test_homeicon(unittest.TestCase):
    def setUp(self):
        driver_path = pwd()
        self.driver = webdriver.Chrome(executable_path=driver_path.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver = cqube(self.driver)
        driver.login_cqube()

    def test_home(self):

        self.driver.find_element_by_xpath(Data.SARD1).click()
        time.sleep(5)
        self.driver.find_element_by_xpath(Data.Home_icon).click()
        time.sleep(5)
        if "home" in self.driver.current_url:
            print("Navigated to Home page!")
        else:
            print("Failed to click on Home icon ")
    def tearDown(self):
        time.sleep(5)
        self.driver.close()


if __name__ == "__main__":
    unittest.main()