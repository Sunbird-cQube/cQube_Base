import time
import unittest
from selenium import webdriver

from Data.parameters import Data
from TS.arg import arg
from TS.reuse_func import cqube
from get_dir import pwd


class SAR(unittest.TestCase):
    def setUp(self):
        driver_path = pwd()
        self.driver = webdriver.Chrome(driver_path.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver = cqube(self.driver)
        driver.login_cqube()
        driver.navigate_to_student_report()

    def test_checking_dots_on_blocks(self):

        time.sleep(10)
        list = self.driver.find_elements_by_class_name(Data.dots)
        print(len(list)-1)
        self.assertNotEqual(0, int(len(list) - 1), msg='Dots are not present on the map')

    def tearDown(self):
        self.driver.close()
