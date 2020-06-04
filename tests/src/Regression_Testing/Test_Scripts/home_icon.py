import csv
import time
import unittest

from selenium import webdriver

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class Home_icon(unittest.TestCase):
    def setUp(self):
        dri = pwd()
        self.driver = webdriver.Chrome(dri.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()
        driver.navigate_to_semester_report()

    def test_clusterbtn(self):
        time.sleep(3)
        print(self.driver.current_url)
        self.driver.find_element_by_id(Data.Home_icon).click()
        print(self.driver.current_url)
    def tearDown(self):
        self.driver.close()


if __name__ == "__main__":
    unittest.main()
