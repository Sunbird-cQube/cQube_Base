import time
import unittest

from selenium import webdriver
from selenium.webdriver import ActionChains

from Data.parameters import Data
from TS.reuse_func import cqube
from get_dir import pwd


class Semester_Home(unittest.TestCase):
    def setUp(self):
        dri = pwd()
        self.driver = webdriver.Chrome(dri.get_driver_path())
        driver = cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()
        driver.navigate_to_semester_report()
    def test_semester(self):
        time.sleep(5)
        lists = self.driver.find_elements_by_class_name(Data.dots)
        def mouseover(i):
            action = ActionChains(self.driver)
            action.move_to_element(lists[i]).perform()
            time.sleep(2)
            del action

        i = 0
        while i < len(lists):
            mouseover(2)
            i = i + 1
        time.sleep(1)
        count = len(lists)
        self.assertNotEqual(0,count,msg="Failed")
    def tearDown(self):
        self.driver.close()

    if __name__ == "__main__":
        unittest.main()