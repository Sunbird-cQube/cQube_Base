import re
import time
import unittest
from selenium import webdriver
from selenium.webdriver import ActionChains

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class Cluster_test(unittest.TestCase):
    def setUp(self):
        dri = pwd()
        self.driver = webdriver.Firefox(executable_path=dri.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()
        driver.navigate_to_semester_report()
    def test_clusterbtn(self):
        time.sleep(5)
        self.driver.find_element_by_xpath(Data.SRD32).click()
        time.sleep(2)
        self.driver.find_element_by_xpath(Data.SRB2).click()
        time.sleep(3)
        amccount = self.driver.find_elements_by_class_name(Data.dots)
        cnt = len(amccount)-1
        print("no of dots :",cnt)
        time.sleep(2)
        amc = self.driver.find_elements_by_xpath(Data.clusterlist)
        time.sleep(3)
        for i in range(len(amc)):
            amc[i].click()
            time.sleep(2)
            dots = self.driver.find_elements_by_class_name(Data.dots)
            count = len(dots)-1
            print(amc[i].text," : ",count)
        count = len(amc)-1
        time.sleep(2)
        self.assertEqual(cnt, count, " not matching counts ")
    def tearDown(self):
        self.driver.close()


if __name__ == "__main__":
    unittest.main()











