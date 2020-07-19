
import time
import unittest
from selenium import webdriver
from selenium.webdriver import ActionChains

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class clusterbtn_click(unittest.TestCase):
    def setUp(self):
        dri = pwd()
        self.driver = webdriver.Chrome(dri.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()
        driver.navigate_to_semester_report()

    def test_clusterbtn(self):
        time.sleep(5)
        self.driver.find_element_by_xpath(Data.Clusters).click()
        dots=self.driver.find_elements_by_xpath(Data.dots)
        footer = self.driver.find_elements_by_xpath(Data.details)
        self.assertNotEqual(0, int(len(dots) - 1), msg='Dots are not present on the map')

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()