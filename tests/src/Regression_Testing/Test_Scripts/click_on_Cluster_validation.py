import re
import time
import unittest
from selenium import webdriver
from selenium.webdriver import ActionChains

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd

class click_on_cluster(unittest.TestCase):
    def setUp(self):
        dri = pwd()
        self.driver = webdriver.Chrome(dri.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()
        driver.navigate_to_semester_report()


    def test_clusterbtn(self):
        time.sleep(5)
        self.driver.find_element_by_xpath(Data.SRD19).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.SRB6).click()
        time.sleep(2    )
        amccount = self.driver.find_elements_by_class_name(Data.dots)
        cnt = len(amccount)-1
        time.sleep(1)
        driver = cqube(self.driver)
        driver.dots_dist()
        time.sleep(2)
        driver.Click_HomeButton()
    def tearDown(self):
        self.driver.close()


if __name__ == "__main__":
    unittest.main()