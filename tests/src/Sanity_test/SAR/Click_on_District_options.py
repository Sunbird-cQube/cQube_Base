import time
import unittest

from selenium import webdriver

from Data.parameters import Data

#script to click on District names list and take screenshot
from TS.reuse_func import cqube
from get_dir import pwd


class District(unittest.TestCase):
    def setUp(self):
        driver_path = pwd()
        self.driver = webdriver.Chrome(driver_path.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver = cqube(self.driver)
        driver.login_cqube()
        driver.navigate_to_student_report()
        time.sleep(5)

    def test_DistOptions(self):
        Distlist =self.driver.find_elements_by_xpath(Data.Dnames)
        for i in Distlist:
            print(i.text)
        print(self.driver.current_url)

    def tearDown(self):
        time.sleep(5)
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
