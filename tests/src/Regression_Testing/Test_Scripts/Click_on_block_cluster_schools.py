import time
import unittest

from Data.parameters import  Data
from selenium import webdriver

from TS.reuse_func import cqube
from get_dir import pwd


class SAROption(unittest.TestCase):

    def setUp(self):
        driver_path= pwd()
        self.driver = webdriver.Chrome(driver_path.get_driver_path())
        self.driver.maximize_window()
        self.driver.implicitly_wait(15)
        driver =cqube(self.driver)
        driver.open_cqube_appln()
        driver.login_cqube()
        driver.navigate_to_student_report()

    def test_SAR(self):
        time.sleep(5)
        self.driver.find_element_by_xpath(Data.SAR_Blocks_btn).click()
        time.sleep(15)
        infob = self.driver.find_elements_by_xpath(Data.details)
        for i in range(len(infob)):
            time.sleep(5)
            print(infob[i].text)

        self.driver.find_element_by_xpath(Data.SAR_Clusters_btn).click()
        time.sleep(15)
        infoc = self.driver.find_elements_by_xpath(Data.details)
        for i in range(len(infoc)):
            time.sleep(5)
            print(infoc[i].text)

        self.driver.find_element_by_xpath(Data.SAR_Schools_btn).click()
        time.sleep(30)
        infos = self.driver.find_elements_by_xpath(Data.details)
        time.sleep(5)
        for i in range(len(infos)):
           print(infos[i].text)

    def tearDown(self):
        time.sleep(5)
        self.driver.close()


if __name__ == "__main__":
    unittest.main()