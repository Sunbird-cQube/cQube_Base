import sys
import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from Data.parameters import Data
from TS.arg import arg
from TS.reuse_func import cqube
from get_dir import pwd


class CqubeLogin(unittest.TestCase):
    def setUp(self):
        driver_path = pwd()
        self.driver = webdriver.Chrome(driver_path.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()

    def test_search(self):
        driver = cqube(self.driver)
        driver.login_cqube()
        driver.navigate_to_student_report()
        x = arg()
        driver.select_month_year(x.list[0], x.list[1])
        time.sleep(5)

    def tearDown(self):
        self.driver.close()
